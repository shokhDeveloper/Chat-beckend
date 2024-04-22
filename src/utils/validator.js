import Joi from "joi";
import path from "node:path";
import { mbSize } from "../config.js";
import { ClientError } from "./error.js";
const username = Joi.string().alphanum().min(3).max(15).error(() =>  new Error("Username is required !")).required();
const password = Joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{3,}$/).min(3).max(15).error(() => new Error("Maximum password length is 15 characters and must contain both letters and numbers")).required();

export const USER_VALIDATOR = Joi.object({
    username: username, 
    password: password
});

export const MESSAGE_VALIDATOR = Joi.object({
    message: Joi.string().min(1).max(100).error(() => new Error("Message is required !")).required(),
    userId: Joi.number().error(() => new Error("User id is required !")).required(),
    authorUserId: Joi.number().error(() => new Error("Send user id is required !")).required()   
});

export const avatarValidator = (req, res, next) => {
    try{
        if(req.files){
            const {avatar:{size, name}} = req.files;
            const imageFormats = [".jpg", ".png", ".jpeg"];
            const avatarExtName = path.extname(name)        
            if(imageFormats.includes(avatarExtName)){
                let fileSize = Math.round((mbSize * mbSize) / size);
                if(fileSize < mbSize) return next();
                else throw new ClientError(413, "The size of the avatar is too large")
            }throw new ClientError(415, "Invalid avatar format ! Supported formats (png, jpeg)")
        }else throw new ClientError(400, "Avatar is not found")
    }catch(error){
        return res.status(error.status || 500).json({message: error.message, statusCode: error.status || 500});
    }
}