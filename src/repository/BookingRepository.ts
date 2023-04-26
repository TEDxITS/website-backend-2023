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
			// Calculate total price
			let totalPrice = 0

			try {
				for (const bookingDetail of bookingData) {
					const ticketData: {
						price: number
						dateOpen: Date
						dateClose: Date
					} | null = await tx.ticket.findFirst({
						where: {
							id: bookingDetail.ticketId,
						},
						select: {
							price: true,
							dateOpen: true,
							dateClose: true,
						},
					})

					if (!ticketData) {
						throw new CustomError(
							StatusCodes.NOT_FOUND,
							"Ticket not found"
						)
					}

					if (isBefore(bookingDate, ticketData.dateOpen)) {
						throw new CustomError(
							StatusCodes.CONFLICT,
							"Ticket is not open yet"
						)
					}

					if (isAfter(bookingDate, ticketData.dateClose)) {
						throw new CustomError(
							StatusCodes.CONFLICT,
							"Ticket is closed"
						)
					}

					totalPrice += ticketData.price
				}
			} catch (err) {
				if (err instanceof Prisma.PrismaClientUnknownRequestError) {
					throw new CustomError(
						StatusCodes.CONFLICT,
						"Ticket has been sold out"
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
	return db.$transaction(
		async (tx) => {
			const tickets = await tx.bookingDetail.findMany({
				where: {
					bookingId: uploadPaymentData.bookingId,
				},
				select: {
					ticketId: true,
				},
			})

			try {
				tickets.forEach(async (ticket) => {
					await tx.ticket.update({
						where: {
							id: ticket.ticketId,
						},
						data: {
							quota: {
								decrement: 1,
							},
						},
					})
				})
			} catch (err) {
				if (err instanceof Prisma.PrismaClientUnknownRequestError) {
					await tx.booking.update({
						where: {
							id: uploadPaymentData.bookingId,
						},
						data: {
							status: BookingStatus.KUOTA_HABIS,
						},
					})

					throw new CustomError(
						StatusCodes.CONFLICT,
						"Ticket has been sold out"
					)
				}
				throw err
			}

			return await db.booking.update({
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
		},
		{
			maxWait: 5000,
			timeout: 10000,
		}
	)
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
