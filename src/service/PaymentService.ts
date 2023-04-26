import { StatusCodes } from "http-status-codes"
import { CustomError } from "../helper/Error"
import * as PaymentRepository from "../repository/PaymentRepository"

export const getAllPayments = async () => {
	const payments = await PaymentRepository.getAllPayments()

	return payments
}

export const getPaymentById = async (paymentId: string) => {
	const payment = await PaymentRepository.getPaymentById(paymentId)

	if (!payment) {
		throw new CustomError(
			StatusCodes.NOT_FOUND,
			"Payment method does not exist"
		)
	}

	return payment
}
