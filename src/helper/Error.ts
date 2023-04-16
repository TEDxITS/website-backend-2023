import { Prisma } from "@prisma/client"
import { StatusCodes, ReasonPhrases } from "http-status-codes"
import Joi from "joi"

export class CustomError extends Error {
    code: number = StatusCodes.INTERNAL_SERVER_ERROR

    constructor(code: number, message: string) {
        super(message)

        this.code = code
    }
}

const errorTypes = [
    Prisma.PrismaClientInitializationError,
    Prisma.PrismaClientRustPanicError,
    Prisma.PrismaClientUnknownRequestError,
    Prisma.PrismaClientValidationError,
]

const knownErrorCodeMessageMapping = {
    "P2007": 'Data invalid',
    "P2015": 'Data not found',
    "P2003": 'The records searched for in the where condition (`{model}.{field} = {value}`) do not exist.',
    "P2023": 'Data format invalid',
}

export const getErrorObject = (err: unknown): CustomError => {
    if (err instanceof CustomError) {
        return err
    }

    let error = new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR)  

    if(err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code in knownErrorCodeMessageMapping) {
            error.code = StatusCodes.BAD_REQUEST
            error.name = err.name
            error.message = knownErrorCodeMessageMapping[err.code as keyof typeof knownErrorCodeMessageMapping]
        }
        return error
    }

    for (const e of errorTypes) {
        if (err instanceof e) {            
            error.code = StatusCodes.BAD_REQUEST
            error.name = err.name
            error.message = err.message
            break
        }
    }

    return error
}

export const parseJoiErrorObject = (errors: Joi.ValidationError) => {
    const err: {[key: string]: any} = {}

    errors.details.forEach((error) => {
        if(error.path[0] in err) {
            err[error.path[0] as string].push(error.message)
        } else {
            err[error.path[0] as string] = [error.message]
        }
    })

    return err
}
