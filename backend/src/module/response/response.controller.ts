import type { Request, Response } from "express";
import { prisma } from "../../common/utils/prisma";
import ApiError from "../../common/utils/api-error";
import ApiResponse from "../../common/utils/api-response";
import { getAuth } from "@clerk/express";
import { UAParser } from "ua-parser-js";

export async function getPollForSubmission(req: Request, res: Response) {
  const { pollId } = req.params;
  const auth = getAuth(req);
  const { accessCode, slug, reSubmit } = req.query;

  if (!pollId) {
    throw ApiError.badRequest("Poll ID is required");
  }

  const existingPoll = await prisma.poll.findUnique({
    where: {
      id: pollId as string,
      slug: slug as string,
      isDeleted: false,
    },
    include: {
        questions: {
            where: {
                isDeleted: false,
            },
            orderBy: {
                order: "asc",
            },
            include: {
                options: {
                    where: {
                        isDeleted: false,
                    },
                    orderBy: {
                        order: "asc",
                    }
                }
            }
        },
        submissions: {
          where: {
            submittedBy: auth.userId || null,
          }
        }
    },
  });

  if (!existingPoll?.id) {
    throw ApiError.notFound("Poll not found");
  }

  if (existingPoll.expiresAt && new Date(existingPoll.expiresAt) < new Date()) {
    throw ApiError.badRequest("This poll has expired");
  }

  if (existingPoll.status !== "PUBLISHED") {
    throw ApiError.badRequest("No poll found with the given ID");
  }

  if (!existingPoll.isPublic && !auth.userId) {
    throw ApiError.unauthorized(
      "You are not authorized to submit response to this poll",
    );
  }

  if (existingPoll.isPublic && !existingPoll.isAnonymousSubmissionAllowed && !auth.userId) {
    throw ApiError.unauthorized(
      "Please login to submit response to this poll",
    );
  }

  if (!existingPoll.isPublic) {
    if (!accessCode) {
      return ApiResponse.ok(res, "Access Code is Required", {
        accessCodeRequired: true,
      });
    } else if (existingPoll.accessCode !== accessCode) {
      throw ApiError.unauthorized("Invalid Access Code");
    }
  }

  const hasAlreadySubmitted = existingPoll.submissions.some((s) => s.submittedBy === auth.userId);
  if (hasAlreadySubmitted && !reSubmit) {
    throw ApiError.badRequest("You have already submitted a response to this poll");
  }
  if (hasAlreadySubmitted && reSubmit && !existingPoll.isAllowedToEditAfterSubmission) {
    throw ApiError.badRequest("Resubmission is not allowed for this poll");
  }

  return ApiResponse.ok(res, "Poll found", existingPoll);
}

export async function getPublicPollAnalytics(req: Request, res: Response) {
  const { pollId } = req.params;

  if (!pollId) {
    throw ApiError.badRequest("Poll ID is required");
  }

  const poll = await prisma.poll.findUnique({
    where: {
      id: pollId as string,
      isDeleted: false,
    },
    include: {
      questions: {
        where: { isDeleted: false },
        orderBy: { order: "asc" },
        include: {
          options: {
            where: { isDeleted: false },
            orderBy: { order: "asc" },
            include: {
              _count: { select: { submissionAnswers: true } },
            },
          },
        },
      },
    },
  });

  if (!poll) {
    throw ApiError.notFound("Poll not found");
  }

  if (!poll.isPublicResponseAnalyticsAllowed) {
    throw ApiError.forbidden("Public analytics are not enabled for this poll");
  }

  if (poll.status !== "PUBLISHED" && poll.status !== "CLOSED") {
    throw ApiError.forbidden("Analytics are not available for this poll");
  }

  const submissions = await prisma.submission.findMany({
    where: { pollId: pollId as string },
    select: {
      id: true,
      isCompleted: true,
      submissionAnswers: { select: { questionId: true } },
    },
  });

  const total = submissions.length;
  const completed = submissions.filter((s) => s.isCompleted).length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const overview = { totalResponses: total, completionRate };

  const answeredSets = submissions.map(
    (s) => new Set(s.submissionAnswers.map((a) => a.questionId)),
  );

  const questions = poll.questions.map((q) => {
    const totalResponses = q.options.reduce(
      (sum, o) => sum + o._count.submissionAnswers,
      0,
    );
    const skipCount = submissions.filter((_, i) => !answeredSets[i]?.has(q.id)).length;

    return {
      questionId: q.id,
      title: q.title,
      totalResponses,
      skipCount,
      options: q.options.map((o) => ({
        optionId: o.id,
        name: o.name,
        count: o._count.submissionAnswers,
        pct:
          totalResponses > 0
            ? Math.round((o._count.submissionAnswers / totalResponses) * 100)
            : 0,
      })),
    };
  });

  return ApiResponse.ok(res, "Public analytics fetched successfully", {
    overview,
    questions,
  });
}

// socket connection for real-time updates of the poll response
export async function submitResponse(req: Request, res: Response) {
  // Destructure the userId (who submitted the response), pollId, questionId and the selected option from the request body
  // Entry the response into the db
  // Emit the updated response to all the clients connected to the poll room

  const auth = getAuth(req);

  const { pollId } = req.params;
  const { responses, feedback, accessCode, rating,  } = req.body;

  if (!pollId) {
    return ApiError.badRequest("Poll ID is required");
  }

  const existingPoll = await prisma.poll.findUnique({
    where: {
      id: pollId as string,
    },
  });

  if (!existingPoll) {
    throw ApiError.notFound("Poll not found");
  }

  if (!existingPoll.isPublic && !auth.userId) {
    throw ApiError.unauthorized(
      "You are not authorized to submit response to this poll",
    );
  }

  if (!existingPoll.isPublic && auth.userId) {
    if (!accessCode) {
      throw ApiError.badRequest("Access Code is required");
    } else if (existingPoll.accessCode !== accessCode) {
      throw ApiError.unauthorized("Invalid Access Code");
    }
  }

  if (
    existingPoll.isPublic &&
    !existingPoll.isAnonymousSubmissionAllowed &&
    !auth.userId
  ) {
    throw ApiError.unauthorized(
      "Please Login to submit response to this poll",
    );
  }

  if (existingPoll.expiresAt && new Date(existingPoll.expiresAt) < new Date()) {
    throw ApiError.badRequest("You cannot submit response to an expired poll");
  }

  if (existingPoll.status !== "PUBLISHED") {
    throw ApiError.badRequest(
      "You cannot submit response to a poll that is not published",
    );
  }

  if (auth.userId) {
    const existingSubmission = await prisma.submission.findUnique({
      where: {
        submittedBy_pollId: {
          submittedBy: auth.userId,
          pollId: pollId as string,
        },
      },
    });

    if (existingSubmission) {
      if (!existingPoll.isAllowedToEditAfterSubmission) {
        throw ApiError.badRequest("Resubmission is not allowed for this poll");
      }
    }
  }

  const isCompleted = (
    responses as Array<{ questionId: string; optionId: string }>
  ).every((q) => {
    return q.optionId !== null && q.optionId !== undefined && q.optionId !== "";
  });
  const response = await prisma.submission.create({
    data: {
      pollId: pollId as string,
      submittedBy: auth.userId || null,
      feedback,
      rating,
      isCompleted,
    },
  });

  if (!response.id) {
    throw ApiError.internalServerError("Failed to submit response");
  }

  const submissionAnswers = await prisma.submissionAnswer.createManyAndReturn({
    data: (responses as Array<{ questionId: string; optionId: string }>).map(
      (q) => ({
        submissionId: response.id,
        questionId: q.questionId,
        optionId: q.optionId,
      }),
    ),
  });
  if (!submissionAnswers || submissionAnswers.length === 0) {
    throw ApiError.internalServerError("Failed to submit answers");
  }
  if (submissionAnswers.length !== responses.length) {
    throw ApiError.internalServerError("Failed to submit all answers");
  }

  const ua = new UAParser(req.headers["user-agent"] || "");
  const device = ua.getDevice();
  const browser = ua.getBrowser();
  const os = ua.getOS();

  const { utmSource, utmMedium, utmCampaign } = req.body;
  const submitMetaData = await prisma.submissionMetaData.create({
    data: {
      submissionId: response.id,
      startedAt: new Date(req.body.startedAt),
      submittedAt: new Date(),
      spendTimePerQuestion: req.body.spendTimePerQuestion || {},
      deviceType: device.type || "desktop",
      browser: browser.name || "Unknown",
      os: os.name || "Unknown",
      locale: req.body.locale || "",
      timezone: req.body.timezone || "",
      screenResolution: req.body.screenResolution || null,
      referrer: req.body.referrer || null,
      utmSource: (utmSource as string) || null,
      utmMedium: (utmMedium as string) || null,
      utmCampaign: (utmCampaign as string) || null,
      userAgent: req.headers["user-agent"] || "Unknown",
    },
  });

  if (!submitMetaData.id) {
    throw ApiError.internalServerError("Failed to submit metadata");
  }

  // Emit live response event to the poll room
  const io = req.app.get("io");
  if (io) {
    const questionCount = await prisma.question.count({
      where: { pollId: pollId as string, isDeleted: false },
    });

    let respondent = "Anonymous";
    if (auth.userId) {
      const user = await prisma.user.findUnique({
        where: { id: auth.userId },
        select: { fullName: true, email: true },
      });
      if (user) {
        respondent = user.fullName || user.email;
      }
    }

    io.to(pollId as string).emit("new-response", {
      submissionId: response.id,
      respondent,
      questionsAnswered: submissionAnswers.length,
      totalQuestions: questionCount,
      answers: (responses as Array<{ questionId: string; optionId: string }>).map((r) => ({
        questionId: r.questionId,
        optionId: r.optionId || null,
      })),
      submittedAt: new Date().toISOString(),
    });
  }

  return ApiResponse.ok(res, "Response submitted successfully", response);
}