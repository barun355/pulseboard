import type { NextFunction, Request, Response } from "express";
import ApiError from "../../../common/utils/api-error";

export default function clerkWebhookMiddleware(req: Request, res: Response, next: NextFunction) {
    const pulseBoardHeader = req.header("X-PulseBoard-Webhook");

    if (!pulseBoardHeader) {
        throw ApiError.unauthorized("Missing X-PulseBoard-Webhook header");
    }

    const CLERK_X_HEADER_WEBHOOK = process.env.CLERK_X_HEADER_WEBHOOK;

    if (!CLERK_X_HEADER_WEBHOOK) {
        throw ApiError.internal("CLERK_X_HEADER_WEBHOOK environment variable is not set");
    }

    if (pulseBoardHeader !== CLERK_X_HEADER_WEBHOOK) {
        throw ApiError.unauthorized("Unauthorized webhook request");
    }

    next();
}
