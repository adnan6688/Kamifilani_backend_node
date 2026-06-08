class AppError extends Error {

    public statusCode: number


    constructor(statusCode: number, message: string, stack?: "") {


        // send message js error (Error)
        super(message)


        // store value of public variable statusCode
        this.statusCode = statusCode

        if (stack) {
            this.stack = stack
        }
        else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export default AppError