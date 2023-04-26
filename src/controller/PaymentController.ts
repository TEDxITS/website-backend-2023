import { StatusCodes } from "http-status-codes"
import { sendData, sendError } from "../helper/ApiResponse"
import { Request, Response } from "express"
import Joi from "joi"
import { uuidSchema } from "../helper/Validation"
import { CustomError } from "../helper/Error"
import * as PaymentService from "../service/PaymentService"

export const getAllPayments = async (req: Request, res: Response) => {
	try {
		const payments = await PaymentService.getAllPayments()

		sendData(res, StatusCodes.OK, payments)
	} catch (err) {
		sendError(res, err)
	}
}

export const getPaymentById = async (req: Request, res: Response) => {
	const id = req.params.id

	const {
		error,
		value: paymentId,
	}: { error: Joi.ValidationError | undefined; value: string | undefined } =
		uuidSchema.validate(id)

	if (error) {
		sendError(res, new CustomError(StatusCodes.BAD_REQUEST, error.message))
		return
	}

	try {
		const payment = await PaymentService.getPaymentById(paymentId as string)

		if (!payment) {
			sendError(
				res,
				new CustomError(
					StatusCodes.NOT_FOUND,
					"Payment with that ID does not exist"
				)
			)
			return
		}

		sendData(res, StatusCodes.OK, payment)
	} catch (err) {
		sendError(res, err)
	}
}
