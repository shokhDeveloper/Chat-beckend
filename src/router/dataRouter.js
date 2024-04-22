import { Router } from "express";
import { dataController } from "../controller/dataController.js";
export const dataRouter = Router();

dataRouter.route("/users").get(dataController.GET);
dataRouter.route("/users/:userId").get(dataController.GET);
dataRouter.route("/messages").get(dataController.USER_MESSAGE.GET)
dataRouter.route("/myMessages").get(dataController.MY_MESSAGE.GET)

// myMessages?userId=2&myUserId=$1