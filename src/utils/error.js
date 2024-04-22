export class ClientError extends Error {
    constructor(status, message){
        super();
        this.status = status;
        this.message = "Client Error: " + message
    }
}

export class ServerError extends Error {
    constructor(message){
        super();
        this.status = 500;
        this.message = "Client Error: " + message
    }
}