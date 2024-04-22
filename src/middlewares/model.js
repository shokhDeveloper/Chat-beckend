import fs from "node:fs";
import path from "node:path";
import { ClientError, ServerError } from "../utils/error.js";
import { USER_VALIDATOR } from "../utils/validator.js";
import sha256 from "sha256";
export const model = (req, res, next) => {
    req.getData = function(fileName){
        try{
            let data = fs.readFileSync(path.join(process.cwd(), "src", "database", `${fileName}.json`));
            data = data ? JSON.parse(data): [];
            return data
        }catch(error){
            return res.status(500).json({message: error.message})
        }
    };
    req.writeData = function(fileName, data){
        try{
            fs.writeFileSync(path.join(process.cwd(), "src", "database", `${fileName}.json`), JSON.stringify(data, null, 4));
            return true
        }catch(error){
            return res.status(500).json({message: error.message})
        }
    };
    req.toCheckUser = function(type, userData){
        try{
            const users = req.getData("users");
            const condition = users.some((user) => user.username == userData.username)
            
            if(type == "register" && condition) return false;
            if(type == "register" && !condition) return true;

            if(type == "login" && condition && users.some((user) => user.password == sha256(userData.password))) return true;
            if(type == "login" && !condition) return false;

        }catch(error){
            return res.status(error.status || 500).json({message: error.message})
        }
    };
    req.toCheckNewUser = function(userData){
        if(USER_VALIDATOR.validate(userData).error instanceof Error){
            throw new ClientError(400, USER_VALIDATOR.validate(userData).error.message);       
        };
    };
    req.saveAvatar = function(avatarName){
        try{
            const {avatar:{mv}} = req.files;
            const filePath = path.join(process.cwd(), "src", "assets", "images", avatarName);
            return mv(filePath);
        }catch(error){
            throw new ServerError(error.message)
        }   
    };
    req.searchData = function(data, querys){
        try{
            querys = structuredClone(querys)
            const store = []
            if(Object.keys(querys).includes("username")){
                const regex = new RegExp(querys["username"], "gi");
                data = data.filter((searchData) => searchData.username.match(regex))
                delete querys.username
            }
            for(let searchData of data ){
                let count = 0;
                for(let key in querys){
                    if(searchData[key] == querys[key]) count ++;
                };
                if(Object.keys(querys).length == count) store.push(searchData);
            }
            return store;
        }catch(error){
            throw new ServerError(error.message)
        }
    };
    req.deleteChatKey = (data) => {
        try{
            const filterData = data.map((data) => {
                delete data.chatUsers;
                return data
            });
            return filterData
        }catch(error){
            return res.status(error.status || 500).json({message: error.message, statusCode: error.status || 500});
        }
    };
    req.repeatUser = (message) => {
        try{    
            const users = req.getData("users");
            const find = users.find((user) => user.userId == message.userId);
            delete find.chatUsers;
            return find;
        }catch(error){
            return res.status(error.status || 500).json({message: error.message, statusCode: error.status || 500});
        }
    }
    req.filterMessage = (data) => {
        try{            
            let store = [];
            for(let i = 0; i<data.length; i++){
                let findUser = req.repeatUser(data[i]);
                if(store.some((user) => user.userId == findUser.userId)) continue;
                else store.push(findUser);
            }
            return store
        }catch(error){
            return res.status(error.status || 500).json({message: error.message, statusCode: error.status || 500});
        }
    }   
    return next();
}
