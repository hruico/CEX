import prisma from "../config/db";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import z from "zod";
import jwt from "jsonwebtoken";
import { password } from "bun";

const signUpSchema = z.object({
  email: z.email(),
  username: z.string(),
  password: z.string().min(8),
});

const signInSchema = z.object({
  username: z.string(),
  password: z.string().min(8),
});

const SignUpController = async (req: Request, res: Response) => {
  const { data, success } = signUpSchema.safeParse(req.body);
  if (!success) {
    res.status(400).json({
      message: "Credential Validation Failed!",
    });
    return;
  }

  const { username, email, password } = data;
  const userExists = await prisma.user.findUnique({
    where: {
      username,
      email,
    },
    select: {
      username: true,
    },
  });

  if (userExists) {
    return res.status(403).json({ message: "User already exists!" });
  }

  const JWT_SECRET = process.env.JWT_SECRET || " ";
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
    },
    select: {
      id: true,
      username: true,
    },
  });

  const userId = user.id;

  const token = jwt.sign(
    {
      userId,
      username,
    },
    JWT_SECRET,
  );

  return res.status(200).json({ message: "Sign up success!", token });
};

const SignInController = async (req: Request, res: Response) => {
  const { data, success } = signInSchema.safeParse(req.body);
  if (!success) {
    res.status(400).json({
      message: "Credential Validation Failed!",
    });
    return;
  }

  const { username, password } = data;

  const user = await prisma.user.findFirst({
    where: {
      username,
    },
  });

  if (!user) {
    return res.status(401).json({
      message: "Invalid Credentials!",
    });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({
      message: "Invalid password!",
    });
  }

  const userId = user.id;
  const JWT_SECRET = process.env.JWT_SECRET || "1";

  const token = jwt.sign(
    {
      userId,
      username,
    },
    JWT_SECRET,
  );

  return res.status(200).json({ message: "Login Success", token });
};

export default { SignInController, SignUpController };
