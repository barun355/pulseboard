import { Router } from 'express';
import { userCreatedHandler } from '../controller/user.webhook.controller';
import type { Request, Response } from 'express';

const router = Router()

router.post("/user:created", (req: Request, res: Response) => {
    const data = req.body;

    const pulseBoardHeader = req.header("X-PulseBoard-Webhook");

    if (!data) {}
})
router.post("/user:updated", () => {})


export default router;
