class HttpException extends Error {
    constructor(status = 500, message = "Something went wrong", data = {}) {
        super(message);
        this.name = "HttpException";
        this.status = status;
        this.data = typeof data === "object" ? data : { message: data };

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = HttpException;
