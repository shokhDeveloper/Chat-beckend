import { ClientError } from "../utils/error.js";

export const dataController = {
    GET: function (req, res){
        try{
            const users = req.getData("users");
            const querys = req.query;
            const params = req.params;
            if(Object.keys(querys).length){
                const searchData = req.searchData(users, querys);
                if(searchData.length) return res.status(200).json({result: req.deleteChatKey(searchData), statusCode: 200});
                
                if(!searchData.length) throw new ClientError(404, "Data not found")
            };
            if(Object.keys(params).length){
                const {userId} = req.params;
                const idx = users.findIndex((user) => user.userId == userId);
                let user = users[idx];
                delete user.chatUsers
                if(idx >= 0) return res.status(200).json({result: users[idx], statusCode: 200});
                if(idx < 0) throw new ClientError(404, "Data not found");
            }           
            return res.status(200).json(req.deleteChatKey(users));
        }catch(error){
            return res.status(error.status || 500).json({message: error.message, statusCode: error.status || 500});
        };  
    },
    USER_MESSAGE:{
        GET: function(req, res){
            try{
                const messages = req.getData("messages")
                const filter = messages.filter((message) => message.authorUserId == req.authorUserId || message.userId == req.authorUserId);
                if(filter.length) {
                    let mappingFilter = filter.map((message) => {
                        return {
                            userId: message.userId == req.authorUserId ? message.authorUserId : message.userId
                        }
                    })
                    mappingFilter = req.filterMessage(mappingFilter);
                    return res.json(mappingFilter);
                }else return res.status(200).json([]);
            }catch(error){
                return res.status(error.status || 500).json({message: error.message, statusCode: error.status || 500})
            }
        }
    },
    MY_MESSAGE: {
        GET: function(req, res) {
            try{
                const querys = req.query;
                if(querys.hasOwnProperty("userId")){
                    let messages = req.getData("messages");
                    const authorUserId = querys.hasOwnProperty("myUserId") ? querys["myUserId"]: req.authorUserId
                    
                    messages = messages.filter((message) => message.userId == querys["userId"] || message.userId == authorUserId );
                    messages = messages.filter((message) => message.authorUserId == querys["userId"] || message.authorUserId == authorUserId);

                        return res.status(200).json(messages)
                }else throw new ClientError(400, "The userId and myUserId is required ! Please enter them in t  he search parameters")                
            }catch(error){
                return res.status(error.status || 500).json({message: error.message, statusCode: error.status || 500});
            }
        }
    }
};
