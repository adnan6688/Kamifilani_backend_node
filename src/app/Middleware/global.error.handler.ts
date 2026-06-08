import { NextFunction, Request, Response } from "express";

import { envVars } from "../config/env";
import { handleZodError } from "../ErrorHelper/handleZodError";
import { handleValidationError } from "../ErrorHelper/handleValidationError";
import AppError from "../ErrorHelper/AppError";




export interface IErrorsources {
    path: string;
    message: string;
}



// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const globalErrorHandler = ((err: any, req: Request, res: Response, next: NextFunction) => {


    let statusCode = 500
    let message = `Something went Wrong!!`

    let errorSources: any = []


    if (err?.name == "ZodError") {

        const simplifiedError = handleZodError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorSources = simplifiedError.errorSource

    }
    else if (err?.name == "ValidationError") {

        const simplifiedError = handleValidationError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorSources = simplifiedError.errorSources

    }
    else if (err.name == "CastError") {
        statusCode = 400;
        message = "Invalid Mongodb Object Id , please provide valid Id"
    }
    else if (err instanceof AppError) {
        statusCode = err.statusCode
        message = err.message
    }
    else if (err instanceof Error) {

        statusCode = 500
        message = err.message
    }


    res.status(statusCode).json({
        success: false,
        message: message,
        errorSources,
        err: envVars.NODE_ENV == "development" ? err : null,
        stack: envVars.NODE_ENV == "development" ? err.stack : null
    })

})
