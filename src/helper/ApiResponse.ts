import { Response } from "express"
import { CustomError, getErrorObject } from "./Error"
import { StatusCodes } from "http-status-codes"

export const sendData = (
	res: Response,
	code: number = StatusCodes.OK,
	data: Array<object> | object | null = null,
	rest: object = {}
): Response => {
	return res.status(code).json({
		data,
		...(rest && rest),
	})
}

// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export const sendOk = (
	res: Response,
	code: number = StatusCodes.OK,
	message = "",
	rest: object = {}
): Response => {
	return res.status(code).json({
		...(message && { message }),
		...(rest && rest),
	})
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendError = (
	res: Response,
	error: any,
	errors: object | null = null,
	rest: object = {}
): Response => {
	const errorObject: CustomError = getErrorObject(error)

	return res.status(errorObject.code).json({
		message: errorObject.message,
		...(errors && { errors }),
		...(rest && rest),
	})
}
