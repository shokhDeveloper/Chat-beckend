import express from "express";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "node:path";
import { authRouter } from "./router/authRouter.js";
import { PORT, corsOptions } from "./config.js";
import { model } from "./middlewares/model.js";
import { authToken } from "./middlewares/authToken.js";
import  messageRouter  from "./router/messageRouter.js";
import { dataRouter } from "./router/dataRouter.js";
import { IP } from "./lib/network.js";

const app = express();
app.use(cors())

app.use(fileUpload());
app.use(cookieParser());
app.use(express.json());

app.use(model);

app.use("/auth", authRouter);
app.use("/avatar", express.static(path.join(process.cwd(), "src", "assets", "images")));
app.use(authToken);

app.use("/message", messageRouter)
app.use("/data", dataRouter)
app.listen(PORT, () => {
    console.log(`Server is running http://${IP}:${PORT}`)
})