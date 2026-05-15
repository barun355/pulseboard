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

  if (!existingPoll.isPublic) {
    if (!accessCode) {
      return ApiResponse.ok(res, "Access Code is Required", {
        accessCodeRequired: true,
      });
    } else if (existingPoll.accessCode !== accessCode) {
      throw ApiError.unauthorized("Invalid Access Code");
    }
  }

  if (existingPoll.submissions.some((s) => s.submittedBy === auth.userId) && !reSubmit) {
    throw ApiError.badRequest("You have already submitted a response to this poll");
  }

  return ApiResponse.ok(res, "Poll found", existingPoll);
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

  // Emit the updated response to all the clients connected to the poll room
  // TODO
  //   const io = req.app.get("io");
  //   io.to(pollId).emit("newResponse", {
  //     message: "New response submitted",
  //     response,
  //   });

  return ApiResponse.ok(res, "Response submitted successfully", response);
}
