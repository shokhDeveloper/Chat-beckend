import {Router} from "express";
import authController from "../controller/authController.js";
import { avatarValidator } from "../utils/validator.js";
export const authRouter = Router();

authRouter.route("/register").post(avatarValidator, authController.REGISTER);
authRouter.route("/login").post(authController.LOGIN)