import type { Request, Response } from "express";
import { prisma } from "../../common/utils/prisma";
import ApiError from "../../common/utils/api-error";
import ApiResponse from "../../common/utils/api-response";
import { getAuth } from "@clerk/express";

export async function createPoll(req: Request, res: Response) {
  try {
    // Destructure the title, description and basic metadata of the poll from the request body like isPublic, expiresAt, is AnonymousSubmissionAllowed etc.
    const {
      slug,
      title,
      description,
      isPublic,
      expiresAt,
      isAnonymousSubmissionAllowed,
      accessCode,
      createdById,
      isAllowedToEditAfterSubmission
    } = req.body;

    const auth = getAuth(req);

    if (!auth.isAuthenticated) {
      throw ApiError.unauthorized("You need to be logged in to create a poll");
    }

    if (auth.userId !== createdById) {
      throw ApiError.unauthorized("You can only create a poll for yourself");
    }

    // Entry the data into the db
    const newPoll = await prisma.poll.create({
      data: {
        slug,
        title,
        description,
        isPublic,
        isAnonymousSubmissionAllowed,
        accessCode: !isPublic ? accessCode : null,
        expiresAt: new Date(expiresAt),
        createdById: createdById, // replace it with `auth.userId`,
        isAllowedToEditAfterSubmission
      },
    });

    if (!newPoll.id) {
      throw ApiError.badRequest("Fail to create the poll");
    }

    // return the success response to the frontend
    return ApiResponse.created(res, "Poll created, successfully", newPoll);
  } catch (error) {
    console.error("Error creating poll:", error);
    throw ApiError.internal(
      "An error occurred while creating the poll",
      error instanceof Error ? [error.stack] : undefined,
    );
  }
}

export async function updatePoll(req: Request, res: Response) {
  try {
    const { pollId } = req.params;
    const user = (req as any).user;

    const {
      title,
      description,
      isPublic,
      expiresAt,
      isAnonymousSubmissionAllowed,
      accessCode,
      isAllowedToEditAfterSubmission
    } = req.body;

    if (!pollId) {
      throw ApiError.badRequest("Poll ID is required");
    }

    const existingPoll = await prisma.poll.findUnique({
      where: {
        id: pollId as string,
      },
    });

    if (!existingPoll) {
      throw ApiError.notFound("Poll not found");
    }

    if (existingPoll.createdById !== user.id) {
      throw ApiError.unauthorized("You are not authorized to update this poll");
    }

    if (existingPoll.status === "CLOSED") {
      throw ApiError.badRequest("You cannot update a closed poll");
    }

    if (existingPoll.expiresAt && new Date(existingPoll.expiresAt) < new Date()) {
      throw ApiError.badRequest("You cannot update an expired poll");
    }

    const updatedPoll = await prisma.poll.update({
      where: {
        id: pollId as string,
      },
      data: {
        title,
        description,
        isPublic,
        isAnonymousSubmissionAllowed,
        accessCode: !isPublic ? accessCode : null,
        expiresAt: new Date(expiresAt),
        isAllowedToEditAfterSubmission
      },
    });

    if (!updatedPoll.id) {
      throw ApiError.internal("Failed to update the poll");
    }

    return ApiResponse.ok(res, "Poll updated successfully", updatedPoll);
  } catch (error) {
    console.error("Error updating poll:", error);
    throw ApiError.internal(
      "An error occurred while updating the poll",
      error instanceof Error ? [error.stack] : undefined,
    );
  }
}

export async function addQuestion(req: Request, res: Response) {
  // Destructure the question, options and pollId
  const { pollId } = req.params;
  const { title, description, isOptional, order, options } = req.body;

  if (!pollId) {
    return ApiError.badRequest("Poll ID is required");
  }

  const existingPoll = await prisma.poll.findUnique({
    where: {
      id: pollId as string,
    },
  });

  if (!existingPoll) {
    return ApiError.notFound("Poll not found");
  }

  // Entry the data into the db
  const newQuestion = await prisma.question.create({
    data: {
      title,
      description,
      order,
      isOptional,
      pollId: pollId as string,
      options: options?.length
        ? {
            create: options.map(
              (o: { name: string; value: string; order: number }) => ({
                name: o.name,
                value: o.value,
                order: o.order,
              }),
            ),
          }
        : undefined,
    },
    include: {
      options: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!newQuestion.id) {
    return ApiError.internal("Failed to add the question to the poll");
  }

  // return the success response to the frontend
  return ApiResponse.created(
    res,
    "Question added to the poll successfully",
    newQuestion,
  );
}

export async function updateQuestion(req: Request, res: Response) {
  // Destructure the question, options and pollId
  const { pollId } = req.params;
  const user = (req as any).user;

  const { questionId, title, description, isOptional } = req.body;

  if (!pollId) {
    return ApiError.badRequest("Poll ID is required");
  }

  const existingPoll = await prisma.poll.findUnique({
    where: {
      id: pollId as string,
    },
  });

  if (!existingPoll) {
    return ApiError.notFound("Poll not found");
  }

  if (existingPoll.createdById !== user.id) {
    return ApiError.unauthorized(
      "You are not authorized to update the question of this poll",
    );
  }

  console.log("updateQuestion: ", {
    questionId,
    title,
    description,
    isOptional,
  });

  // Update the data into the db
  const updatedQuestion = await prisma.question.update({
    where: {
      id: questionId,
    },
    data: {
      pollId: pollId as string,
      title,
      description,
      isOptional,
    },
  });

  if (!updatedQuestion.id) {
    return res
      .status(500)
      .json({ message: "Failed to update the question of the poll" });
  }

  // return the success response to the frontend
  return res.status(200).json({
    message: "Question updated successfully",
    data: updatedQuestion,
  });
}

export async function updateQuestionOrder(req: Request, res: Response) {
  const { pollId } = req.params;
  const user = (req as any).user;
  const { questions } = req.body;

  if (!pollId) {
    return ApiError.badRequest("Poll ID is required");
  }

  const existingPoll = await prisma.poll.findUnique({
    where: {
      id: pollId as string,
    },
  });

  if (!existingPoll) {
    return ApiError.notFound("Poll not found");
  }

  if (existingPoll.createdById !== user.id) {
    return ApiError.unauthorized(
      "You are not authorized to update the question order of this poll",
    );
  }

  const result = await prisma.$transaction(
    questions.map((q: { id: string; order: number }) =>
      prisma.question.update({
        where: { id: q.id },
        data: { order: q.order },
      }),
    ),
  );

  if (result.length === 0) {
    return ApiError.internal("Failed to update the question order of the poll");
  }

  if (result.length !== questions.length) {
    return ApiError.internal(
      "Failed to update some of the questions order of the poll",
      [`Updated: ${result.length}, Expected to update: ${questions.length}`],
    );
  }

  // return the success response to the frontend
  return ApiResponse.ok(res, "Question order updated successfully", result);
}

export async function updateOptions(req: Request, res: Response) {
  // Destructure the question, options and pollId
  const { pollId, questionId } = req.params;
  const user = (req as any).user;

  const { options } = req.body;

  if (!pollId) {
    return ApiError.badRequest("Poll ID is required");
  }

  const existingPoll = await prisma.poll.findUnique({
    where: {
      id: pollId as string,
    },
    include: {
      questions: {
        orderBy: { order: "asc" },
        include: {
          options: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  if (!existingPoll) {
    return ApiError.notFound("Poll not found");
  }

  if (existingPoll.createdById !== user.id) {
    return ApiError.unauthorized(
      "You are not authorized to update the option of this poll",
    );
  }

  const existingQuestion = existingPoll.questions.find(
    (q) => q.id === (questionId as string),
  );

  const optionToBeUpdated = [];

  for (const option of existingQuestion?.options || []) {
    const updatedOption = options.find((o) => o.id === option.id);
    if (updatedOption) {
      optionToBeUpdated.push(updatedOption);
    }
  }

  const result = await prisma.$transaction(
    optionToBeUpdated.map((o) =>
      prisma.option.update({
        where: { id: o.id },
        data: {
          name: o.name,
          value: o.value,
          order: o.order,
        },
      }),
    ),
  );

  if (result.length === 0) {
    return ApiError.internal("Failed to update the options of the poll");
  }

  if (result.length !== optionToBeUpdated.length) {
    return ApiError.internal(
      "Failed to update some of the options of the poll",
      [
        `Updated: ${result.length}, Expected to update: ${optionToBeUpdated.length}`,
      ],
    );
  }

  // return the success response to the frontend
  return ApiResponse.ok(res, "Options updated successfully", result);
}

export async function addOptions(req: Request, res: Response) {
  const { pollId, questionId } = req.params;
  const user = (req as any).user;
  const { options } = req.body;

  if (!pollId || !questionId) {
    return ApiError.badRequest("Poll ID and Question ID are required");
  }

  const existingPoll = await prisma.poll.findUnique({
    where: {
      id: pollId as string,
    },
  });

  if (!existingPoll) {
    return ApiError.notFound("Poll not found");
  }

  if (existingPoll.createdById !== user.id) {
    return ApiError.unauthorized(
      "You are not authorized to add options to this poll",
    );
  }

  const updatedQuestion = await prisma.question.update({
    where: {
      id: questionId as string,
    },
    data: {
      options: {
        create: options.map(
          (o: { name: string; value: string; order: number }) => ({
            name: o.name,
            value: o.value,
            order: o.order,
          }),
        ),
      },
    },
    include: {
      options: {
        where: { isDeleted: false },
        orderBy: { order: "asc" },
      },
    },
  });

  return ApiResponse.created(
    res,
    "Options added successfully",
    updatedQuestion.options,
  );
}

export async function deleteQuestion(req: Request, res: Response) {
  // Destructure the questionId, pollId and optionId from the request params
  const { pollId, questionId } = req.params;
  const user = (req as any).user;

  if (!pollId || !questionId) {
    return ApiError.badRequest("Poll ID and Question ID are required");
  }

  const existingPoll = await prisma.poll.findUnique({
    where: {
      id: pollId as string,
    },
  });

  if (!existingPoll) {
    return ApiError.notFound("Poll not found");
  }

  if (existingPoll.createdById !== user.id) {
    return ApiError.unauthorized(
      "You are not authorized to delete the question of this poll",
    );
  }

  // Delete the question from the db
  await prisma.question.update({
    where: {
      id: questionId as string,
    },
    data: {
      isDeleted: true,
    },
  });

  await prisma.option.updateMany({
    where: {
      questionId: questionId as string,
    },
    data: {
      isDeleted: true,
    },
  });

  // return the success response to the frontend
  return ApiResponse.deleted(res, "Question deleted successfully", {
    questionId,
  });
}

export async function deleteOption(req: Request, res: Response) {
  // Destructure the questionId, pollId and optionId from the request params
  const { pollId, questionId, optionId } = req.params;
  const user = (req as any).user;

  if (!pollId || !questionId || !optionId) {
    return ApiError.badRequest(
      "Poll ID, Question ID and Option ID are required",
    );
  }

  const existingPoll = await prisma.poll.findUnique({
    where: {
      id: pollId as string,
    },
  });

  if (!existingPoll) {
    return ApiError.notFound("Poll not found");
  }

  if (existingPoll.createdById !== user.id) {
    return ApiError.unauthorized(
      "You are not authorized to delete the option of this poll",
    );
  }

  // Delete the option from the db
  await prisma.option.update({
    where: {
      id: optionId as string,
    },
    data: {
      isDeleted: true,
    },
  });

  // return the success response to the frontend
  return ApiResponse.deleted(res, "Option deleted successfully", { optionId });
}

export async function updatePollStatus(req: Request, res: Response) {
  const { pollId } = req.params;
  const { status } = req.body;
  const user = (req as any).user;

  if (!pollId) {
    return ApiError.badRequest("Poll ID is required");
  }

  const existingPoll = await prisma.poll.findUnique({
    where: {
      id: pollId as string,
    },
  });

  if (!existingPoll) {
    return ApiError.notFound("Poll not found");
  }

  if (existingPoll.createdById !== user.id) {
    return ApiError.unauthorized(
      "You are not authorized to update the status of this poll",
    );
  }

  if (existingPoll.expiresAt && new Date(existingPoll.expiresAt) < new Date()) {
    return ApiError.badRequest("You cannot update the status of an expired poll");
  }

  if (existingPoll.status === "CLOSED") {
    return ApiError.badRequest("You cannot update the status of a closed poll");
  }

  const updatedPoll = await prisma.poll.update({
    where: {
      id: pollId as string,
    },
    data: {
      status,
    },
  });

  if (!updatedPoll.id) {
    return ApiError.internal("Failed to update the status of the poll");
  }

  // return the success response to the frontend
  return ApiResponse.ok(res, "Poll status updated successfully", updatedPoll);

}

export async function getPollById(req: Request, res: Response) {
  // Destructure the pollId from the request params
  const user = (req as any).user;
  const { pollId } = req.params;

  if (!pollId) {
    throw ApiError.badRequest("Poll ID is required");
  }

  const poll = await prisma.poll.findFirst({
    where: {
      id: pollId as string,
      isDeleted: false,
    },
    include: {
      questions: {
        orderBy: { order: "asc" },
        where: { isDeleted: false },
        include: {
          options: {
            orderBy: { order: "asc" },
            where: { isDeleted: false },
          },
        },
      },
      _count: {
        select: { submissions: true },
      },
    },
  });

  if (!poll) {
    return res.status(404).json({ message: "Poll not found" });
  }

  console.log("poll: ", poll);

  const isPollOwnerAccessing = poll.createdById === user.id;

  if (isPollOwnerAccessing) {
    return res.status(200).json({
      message: "Poll fetched successfully",
      data: poll,
    });
  }

  if (!poll.isPublic && !isPollOwnerAccessing) {
    return res.status(403).json({
      message:
        "This poll is private. Please login and enter the access code to access the poll",
    });
  }

  if (!poll.isAnonymousSubmissionAllowed) {
    return res.status(200).json({
      message: "Poll fetched successfully. Please login to submit the response",
      data: poll,
    });
  }

  return res.status(200).json({
    message: "Poll fetched successfully",
    data: poll,
  });
}

export async function getPolls(req: Request, res: Response) {
  const auth = getAuth(req);

  const polls = await prisma.poll.findMany({
    where: {
      createdById: (req as any).auth.userId,
      isDeleted: false,
    },
    include: {
      _count: {
        select: {
          submissions: true,
          questions: true,
        },
      },
    },
  });

  if (!polls) {
    return res.status(404).json({ message: "Poll not found" });
  }

  console.log("req: ", auth.userId);
  console.log("Polls: ", { polls, userId: auth.userId });

  return res.status(200).json({
    message: "Poll fetched successfully",
    data: polls,
  });
}

export async function getResults(req: Request, res: Response) {
  // Destructure the pollId from the request params
  const { pollId } = req.params;

  // Fetch the poll results from the db
  const poll = await prisma.poll.findUnique({
    where: {
      id: pollId,
    },
  });

  if (!poll?.id) {
    return res.status(404).json({ message: "Poll not found" });
  }

  const isPollOwnerAccessing = poll.createdById === (req as any).user.id;

  const pollResults = await prisma.submission.findFirst({
    where: {
      pollId,
    },
  });

  if (isPollOwnerAccessing) {
    return res.status(200).json({
      message: "Poll results fetched successfully",
      data: pollResults,
    });
  }

  if (!poll.isPublic && !isPollOwnerAccessing && !pollResults?.isPublic) {
    return res.status(403).json({
      message: "This poll is private. Please login to access the results",
    });
  }

  // return the poll results to the frontend
  return res.status(200).json({
    message: "Poll results fetched successfully",
    data: pollResults,
  });
}
