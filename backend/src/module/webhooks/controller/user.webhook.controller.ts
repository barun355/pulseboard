import type { Request, Response } from "express";
import ApiError from "../../../common/utils/api-error";
import { prisma } from "../../../common/utils/prisma";

export async function createUserController(req: Request, res: Response) {
    const data = req.body;

    if (!data) {
        throw ApiError.badRequest("Missing user data in request body");
    }

    if (data.type !== "user.created") {
        throw ApiError.badRequest("Invalid webhook event type");
    }

    // Process the user.created event
    const userData = data.data;

    const existingUser = await prisma.user.findUnique({
        where: {
            id: userData.id
        }
    })

    if (existingUser) {
        throw ApiError.badRequest("User already exists");
    }

    // Create the new user
    const newUser = await prisma.user.create({
        data: {
            id: userData.id,
            email: userData.email_addresses[0].email_address,
            username: userData.username,
            fullName: userData.first_name + " " + userData.last_name,
            profileImage: userData.profile_image_url,
        }
    });

    if (!newUser) {
        throw ApiError.internal("Failed to create user");
    }

    return res.status(201).json({ message: "User created successfully" });
}