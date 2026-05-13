import express from 'express';
import type { Response } from 'express';
import pollRouter from './src/module/poll/poll.router';
import webhooksRouter from './src/module/webhooks/user.webhook';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'node:http';

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    }
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
}))

app.get('/health', (_, res: Response) => {
    return res.status(200).json({ status: 'ok' });
})

app.use("/api/v1/poll", pollRouter)
app.use("/api/v1/webhooks", webhooksRouter)


io.on("connection", (socket) => {
    console.log("A user connected: ", socket.id);

    socket.on("disconnect", () => {
        console.log("A user disconnected: ", socket.id);
    });
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});