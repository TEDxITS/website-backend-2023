import { Response } from "express"

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

export const sendError = (res: Response, code: number = 500, errors: object | null = null, message: string = "", rest: object = {}) : Response => {
    return res.status(code).json({
        ...(message && {message}),
        ...(errors && {errors}),
        ...(rest && rest)
    })
}
