import { Router } from "express";
import authController from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/signup", authController.SignUpController);
authRouter.post("/signin", authController.SignInController);

export default authRouter;
