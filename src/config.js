import { config } from "dotenv"
config();

export const PORT = 4000;
export const mbSize = 1024;
export const maxMbSize = 5;
export const tokenConfig = {
    tokenExpiresIn: "20d",
    BECKEND_KEY: process.env.BECKEND_KEY,
    postmanUserAgent: "PostmanRuntime/7.37.3"
}
const allowList = ["http://localhost:3000"]
export const corsOptions = {
    origin: function(origin, callBack) {
        if(allowList.includes(origin)){
            callBack(null, true)
        }else callBack(new Error("Cors Error"))
    }
}