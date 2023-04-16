import { StatusCodes } from "http-status-codes";
import { CustomError } from "../helper/Error";
import * as PaymentRepository from "../repository/PaymentRepository";

export const getAllPayments = async () => {
	try {
		const payments = await PaymentRepository.getAllPayments();

		return payments;
	} catch (err) {
		throw err;
	}
};

export const getPaymentById = async (paymentId: string) => {
	try {
		const payment = await PaymentRepository.getPaymentById(paymentId);

		if(!payment) {
			throw new CustomError(StatusCodes.NOT_FOUND, "Payment method does not exist");
		}

		return payment;
	} catch (err) {
		throw err;
	}
};
