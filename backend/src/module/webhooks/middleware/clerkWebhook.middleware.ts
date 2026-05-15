import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import ApiError from "../../../common/utils/api-error";

export default function clerkWebhookMiddleware(req: Request, res: Response, next: NextFunction) {
    const pulseBoardHeader = req.header("X-PulseBoard-Webhook");

    if (!pulseBoardHeader) {
        throw ApiError.unauthorized("Missing X-PulseBoard-Webhook header");
    }

    if (pulseBoardHeader === process.env.CLERK_X_HEADER_WEBHOOK) {
        throw ApiError.unauthorized("Unauthorized webhook request");
    }

    next();
}
