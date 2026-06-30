import type { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "./env";
import type { RequestWithIdAndUsername } from "../types/exchange.schema";

export interface TokenPayload {
  userId: string;
  userName: string;
}

export function createToken(payload: TokenPayload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: "7d" });
}

export function authMiddleware(
  req: RequestWithIdAndUsername,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  const token =
    typeof authHeader === "string" && authHeader.startsWith("Bearer")
      ? authHeader.slice(7)
      : undefined;

  if (!token) {
    res.status(401).json({ message: "Missing Auth token" });
    return;
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret) as TokenPayload;
    req.userId = payload.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid Auth Token" });
    return;
  }
}
