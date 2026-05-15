import type { RoleT } from "../../../types";
import ApiError from "../utils/api-error";
import type { NextFunction, Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { prisma } from "../utils/prisma";

async function authenticate(req: Request, _: Response, next: NextFunction) {
  const auth = getAuth(req);

  if (!auth.isAuthenticated) {
    throw ApiError.unauthorized(
      "You need to be logged in to access this resource",
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: auth.userId,
    },
  });

  if (!user) {
    throw ApiError.unauthorized("User not found");
  }

  if (!auth.isAuthenticated) {
    throw ApiError.unauthorized(
      "You need to be logged in to access this resource",
    );
  }
  (req as any).user = user;
  next();
}

function authorize(...roles: RoleT[]) {
  return async (req: Request, _: Response, next: NextFunction) => {
    const auth = getAuth(req);

    if (!auth.isAuthenticated) {
      throw ApiError.unauthorized(
        "You need to be logged in to access this resource",
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: auth.userId,
      },
    });

    if (!user) {
      throw ApiError.unauthorized("User not found");
    }

    if (!roles.includes(user.role as RoleT)) {
      return next(
        ApiError.unauthorized("You are not authorized to access this resource"),
      );
    }

    (req as any).role = user.role as RoleT;

    next();
  };
}

export { authenticate, authorize };
