import { Router } from "express";
import { messageController } from "../controller/messageController.js";

const messageRouter = Router();

messageRouter.route("/").post(messageController.POST);

export default messageRouter