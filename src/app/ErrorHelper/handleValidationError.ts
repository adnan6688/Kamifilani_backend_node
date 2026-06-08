import { IErrorsources } from "../Middleware/global.error.handler"


export const handleValidationError = (err: any) => {

    const errorSources: IErrorsources[] = []
    const errors = Object.values(err.errors)
    errors.forEach((errorObject: any) => {
        errorSources.push({
            path: errorObject.path,
            message: errorObject.message
        })
    })

    return {
        statusCode : 400, 
        message : "Validation Error!", 
        errorSources
    }
}