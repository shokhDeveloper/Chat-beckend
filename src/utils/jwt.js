import pkg from "jsonwebtoken"
import { tokenConfig  } from "../config.js"
import { ClientError, ServerError } from "./error.js"
const {sign, verify} = pkg
export const launchToken = {
    createToken: function(payload){
        try{
            return sign(payload, tokenConfig.BECKEND_KEY, {expiresIn: tokenConfig.tokenExpiresIn })
        }catch(error){
            throw new ServerError("Failed to generate token")
        }
    },
    parsedToken: function(token){
        try{
            return verify(token,  tokenConfig.BECKEND_KEY)
        }catch(error){
            throw new ClientError(401, "Failed to parse token")
        }
    }
}