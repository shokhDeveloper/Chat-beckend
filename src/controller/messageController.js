import { ClientError } from "../utils/error.js";
import { MESSAGE_VALIDATOR } from "../utils/validator.js";

export const messageController = {
    POST: function(req, res) {
        try{
            const messages = req.getData("messages")
            let message = req.body;
            const querys = req.query;
            if(querys && querys.hasOwnProperty("userId")){
                if(MESSAGE_VALIDATOR.validate(message).error instanceof Error) throw new ClientError(400, MESSAGE_VALIDATOR.validate(message).error.message);
                if(message.userId) messages.push(message);
                req.writeData("messages", messages);
                res.status(201).json({message: "Message successfully sent", sendMessage: message, statusCode: 201});
            }else throw new ClientError(400, "Who is the message sent to? username or userId is required !");
        }catch(error){
            return res.status(error.status || 500).json({message: error.message})
        }
    }
}