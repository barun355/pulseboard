import type { Request, Response } from "express";
import { prisma } from "../../common/utils/prisma";

export async function createPoll(req: Request, res: Response) {
  // Destructure the title, description and basic metadata of the poll from the request body like isPublic, expiresAt, is AnonymousSubmissionAllowed etc.
  const {
    slug,
    title,
    description,
    isPublic,
    expiresAt,
    isAnonymousSubmissionAllowed,
  } = req.body;

  // Entry the data into the db
  const newPoll = await prisma.poll.create({
    data: {
      slug,
      title,
      description,
      isPublic,
      isAnonymousSubmissionAllowed,
      expiresAt: new Date(expiresAt),
      createdById: (req as any).user.id,
    },
  });

  if (!newPoll.id) {
    return res.status(500).json({ message: "Failed to create the poll" });
  }
  // return the success response to the frontend
  return res.status(201).json({
    message: "Poll created successfully",
    data: {
      slug,
      title,
      description,
      isPublic,
      isAnonymousSubmissionAllowed,
      expiresAt,
    },
  });
}

export async function addQuestion(req: Request, res: Response) {
  // Destructure the question, options and pollId
  const { pollId } = req.params;
  const { title, description, isOptional, order, options } = req.body;

  if (!pollId) {
    return res.status(400).json({ message: "Poll ID is required" });
  }

  // Entry the data into the db
  const newQuestion = await prisma.question.create({
    data: {
      title,
      description,
      order,
      isOptional,
      pollId
    },
  });

  if (!newQuestion.id) {
    return res
      .status(500)
      .json({ message: "Failed to add the question to the poll" });
  }

  // return the success response to the frontend
  return res.status(201).json({
    message: "Question added to the poll successfully",
    data: newQuestion,
  });
}

export async function updateQuestion(req: Request, res: Response) {
  // Destructure the question, options and pollId
  const { pollId } = req.params;
  const { questionId, title, description, order, options } = req.body;

  // Update the data into the db
  const updatedQuestion = await prisma.question.update({
    where: {
      id: questionId,
    },
    data: {
      pollId,
      title,
      description,
      order,
      options,
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

export async function updatePollStatus(req: Request, res: Response) {
  // Destructure the pollId and the new status of the poll
  const { pollId, status } = req.body;

  // Update the status of the poll in the db
  const updatedPoll = await prisma.poll.update({
    where: {
      id: pollId,
    },
    data: {
      status,
    },
  });

  if (!updatedPoll.id) {
    return res
      .status(500)
      .json({ message: "Failed to update the status of the poll" });
  }

  // return the success response to the frontend
  return res.status(200).json({
    message: "Poll status updated successfully",
    data: updatedPoll,
  });
}

export async function getPoll(req: Request, res: Response) {
  // Destructure the pollId from the request params
  const { pollId } = req.params;

  // Check if the poll exists in the db
  // Check if the poll is public or private.
  // Check if the poll is allowed for anonymous submission or not
  // combine check if:
  // 1. Public + allowed for anonymous submission -> return the poll data
  // 2. Public + not allowed for anonymous submission -> return the poll data but with a flag that the user needs to login to submit the response
  // 3. Private + not allowed for anonymous submission -> return the poll data but with a flag that the user needs to login and enter the access code to submit the response
  const poll = await prisma.poll.findUnique({
    where: {
      id: pollId,
    },
    include: {
      question: {
        take: 10,
        include: {
          option: true,
        }
      },
    }
  });

  if (!poll) {
    return res.status(404).json({ message: "Poll not found" });
  }

  const isPollOwnerAccessing = poll.createdById === (req as any).user.id;

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

// socket connection for real-time updates of the poll response
export async function submitResponse(req: Request, res: Response) {
  // Destructure the userId (who submitted the response), pollId, questionId and the selected option from the request body
  // Entry the response into the db
  // Emit the updated response to all the clients connected to the poll room
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
