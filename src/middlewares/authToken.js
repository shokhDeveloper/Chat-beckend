import { launchToken } from "../utils/jwt.js";
import { ClientError } from "../utils/error.js";

export const authToken = (req, res, next) => {
    try{
        const {token} = req.headers;
        if(token){
            const users = req.getData("users");
            const {userId, userAgent} = launchToken.parsedToken(token);
            if(!userId || !userAgent) throw new ClientError(401, "Token limit has expired");
            if(users.some((user) => user.userId == userId) && req.headers["user-agent"] == userAgent) {
                req.authorUserId = userId
                return next();
            }
            else throw new ClientError(401, "Token is invalid !")
        }else throw new ClientError(401, "Token not found")
    }catch(error){
        return res.status(error.status || 500).json({message: error.message})
    }
}