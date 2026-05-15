import { Router } from 'express';
import { createUserController } from '../controller/user.webhook.controller';
import clerkWebhookMiddleware from '../middleware/clerkWebhook.middleware';

const router = Router()

router.post("/user.created", clerkWebhookMiddleware, createUserController)


export default router;
