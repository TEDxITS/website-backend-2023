import { Response } from "express"
import { CustomError, getErrorObject } from "./Error"

export const sendData = (res: Response, code: number = 200,  data: Array<object> | object | null = null, rest: object ={}): Response => {
    return res.status(code).json({
        data,
        ...(rest && rest)
    })
}

export const sendOk = (res: Response, code: number = 200, message:string = '', rest: object = {}) : Response => {    
    return res.status(code).json({
        ...(message && {message}),
        ...(rest && rest)
    })
}

export const sendError = (res: Response, error: any, errors: object | null = null, rest: object = {}) : Response => {
    const errorObject: CustomError = getErrorObject(error)

    return res.status(errorObject.code).json({
        message: errorObject.message,
        ...(errors && {errors}),
        ...(rest && rest)
    })
}
