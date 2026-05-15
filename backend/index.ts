import express from 'express';
import type { Response } from 'express';
import pollRouter from './src/module/poll/poll.router';
import submitRouter from './src/module/response/response.router';
import webhooksRouter from './src/module/webhooks/route/user.webhook.route';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import { clerkMiddleware } from '@clerk/express';
import globalErrorHandler from './src/common/middleware/globalError.middleware';
import { authenticate } from './src/common/middleware/auth.middleware';

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: [
            process.env.FRONTEND_URL || 'http://localhost:5173',
            process.env.LANDING_PAGE_URL || 'http://localhost:3000',
        ],
    }
})

app.set("io", io);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:5173',
        process.env.LANDING_PAGE_URL || 'http://localhost:3000',
        "http://localhost:8080"
    ],
}))

app.use(clerkMiddleware({
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY || '',
    secretKey: process.env.CLERK_SECRET_KEY || '',
}))

app.get('/health', (_, res: Response) => {
    return res.status(200).json({ status: 'ok' });
})

app.use("/api/v1/poll", authenticate, pollRouter)
app.use("/api/v1/submit", submitRouter)
app.use("/api/v1/webhooks", webhooksRouter)

io.on("connection", (socket) => {
    console.log("A user connected: ", socket.id);

    socket.on("join-poll", ({ pollId }: { pollId: string }) => {
        socket.join(pollId);
        console.log(`Socket ${socket.id} joined poll room: ${pollId}`);
    });

    socket.on("leave-poll", ({ pollId }: { pollId: string }) => {
        socket.leave(pollId);
        console.log(`Socket ${socket.id} left poll room: ${pollId}`);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected: ", socket.id);
    });
})

app.use(globalErrorHandler);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});