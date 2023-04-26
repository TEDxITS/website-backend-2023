import { Prisma } from "@prisma/client"
import db from "../config/Db"
import {
	BookingDetailDataModel,
	BookingDetailRequest,
	BookingStatus,
	UploadPaymentRequest,
} from "../model/BookingModel"
import { CustomError } from "../helper/Error"
import { StatusCodes } from "http-status-codes"
import { isAfter, isBefore } from "../util/Util"

export const getAllBookings = () => {
	return db.booking.findMany({
		select: {
			id: true,
			orderingUser: true,
			status: true,
			totalPrice: true,
			paymentProof: true,
			verificator: true,
			isActive: true,
			deadline: true,
		},
	})
}

export const getBookingById = (id: string) => {
	return db.booking.findFirst({
		where: {
			id,
		},
		select: {
			id: true,
			orderingUser: true,
			status: true,
			totalPrice: true,
			paymentProof: true,
			verificator: true,
			isActive: true,
			deadline: true,
		},
	})
}

export const getBookingDetailById = (id: string) => {
	return db.bookingDetail.findUnique({
		where: {
			id,
		},
		select: {
			name: true,
			email: true,
			qrLink: true,
			ticket: {
				select: {
					id: true,
					name: true,
					type: true,
					price: true,
				},
			},
		},
	})
}

export const getBookingDetailsByBookingId = (bookingId: string) => {
	return db.bookingDetail.findMany({
		where: {
			bookingId,
		},
		select: {
			id: true,
			name: true,
			email: true,
			phoneNumber: true,
			qrLink: true,
			ticket: {
				select: {
					id: true,
					name: true,
					type: true,
					price: true,
				},
			},
		},
	})
}

export const getBookingByUserId = (userId: string) => {
	return db.booking.findMany({
		where: {
			orderingUser: userId,
		},
		select: {
			id: true,
			orderingUser: true,
			status: true,
			totalPrice: true,
			paymentProof: true,
			verificator: true,
			isActive: true,
			deadline: true,
			bookingDetails: {
				select: {
					id: true,
					phoneNumber: true,
					email: true,
					name: true,
					qrLink: true,
					ticket: {
						select: {
							id: true,
							name: true,
							type: true,
							price: true,
						},
					},
				},
			},
		},
	})
}

export const createBooking = (
	userId: string,
	bookingData: Array<BookingDetailRequest>,
	deadline: Date,
	bookingDate: Date
) => {
	return db.$transaction(
		async (tx) => {
			// Decrement ticket quota and calculate total price
			let totalPrice = 0

			try {
				for (const bookingDetail of bookingData) {
					const {
						price,
						dateOpen,
						dateClose,
					}: { price: number; dateOpen: Date; dateClose: Date } =
						await tx.ticket.update({
							where: {
								id: bookingDetail.ticketId,
							},
							data: {
								quota: {
									decrement: 1,
								},
							},
							select: {
								price: true,
								dateOpen: true,
								dateClose: true,
							},
						})

					if (isBefore(bookingDate, dateOpen)) {
						throw new CustomError(
							StatusCodes.CONFLICT,
							"Ticket is not open yet"
						)
					}

					if (isAfter(bookingDate, dateClose)) {
						throw new CustomError(
							StatusCodes.CONFLICT,
							"Ticket is closed"
						)
					}

					totalPrice += price
				}
			} catch (err) {
				if (err instanceof Prisma.PrismaClientUnknownRequestError) {
					throw new CustomError(
						StatusCodes.CONFLICT,
						"Ticket quota is not available"
					)
				}
				throw err
			}

			// Create booking
			const booking = await tx.booking.create({
				data: {
					totalPrice,
					orderingUser: userId,
					deadline,
				},
				select: {
					id: true,
					totalPrice: true,
					status: true,
					paymentProof: true,
				},
			})

			await tx.bookingDetail.createMany({
				data: bookingData.map((bookData) => {
					return {
						bookingId: booking.id,
						email: bookData.email,
						name: bookData.name,
						phoneNumber: bookData.phoneNumber,
						ticketId: bookData.ticketId,
					}
				}) as Array<BookingDetailDataModel>,
			})

			return booking
		},
		{
			maxWait: 5000,
			timeout: 10000,
		}
	)
}

export const uploadPaymentProof = (uploadPaymentData: UploadPaymentRequest) => {
	return db.booking.update({
		where: {
			id: uploadPaymentData.bookingId,
		},
		data: {
			paymentProof: uploadPaymentData.paymentProof,
			status: BookingStatus.MENUNGGU_VERIFIKASI,
		},
		select: {
			id: true,
			totalPrice: true,
			status: true,
			paymentProof: true,
			isActive: true,
			deadline: true,
		},
	})
}

export const verifyBooking = (adminId: string, bookingId: string) => {
	return db.booking.update({
		where: {
			id: bookingId,
		},
		data: {
			status: BookingStatus.TERVERIFIKASI,
			verificator: adminId,
		},
		select: {
			id: true,
			totalPrice: true,
			status: true,
			paymentProof: true,
			isActive: true,
			deadline: true,
		},
	})
}
