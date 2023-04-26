import * as AdminRepository from "../repository/AdminRepository"
import * as UserRepository from "../repository/UserRepository"
import * as BookingRepository from "../repository/BookingRepository"
import { CustomError } from "../helper/Error"
import { StatusCodes } from "http-status-codes"
import {
	BookingDetailRequest,
	BookingStatus,
	UploadPaymentRequest,
} from "../model/BookingModel"
import { getBookingDeadline, isAfter } from "../util/Util"
import { EmailType, sendEmail } from "../helper/Email"

const bookingStatusMessageMapping = {
	[BookingStatus.MENUNGGU_PEMBAYARAN]:
		"The booking is waiting for payment upload",
	[BookingStatus.MENUNGGU_VERIFIKASI]:
		"The booking is waiting for verification",
	[BookingStatus.TERVERIFIKASI]: "The booking is already verified",
	[BookingStatus.KUOTA_HABIS]: "The ticket is sold out",
}

export const getAllBookings = async () => {
	const bookings = await BookingRepository.getAllBookings()

	return bookings
}

export const getBookingById = async (
	bookingId: string,
	userId: string,
	isAdmin: boolean
) => {
	let user = null

	if (isAdmin) {
		user = await AdminRepository.getAdminById(userId)
	} else {
		user = await UserRepository.getUserById(userId)
	}

	if (!user) {
		throw new CustomError(StatusCodes.UNAUTHORIZED, "User does not exist")
	}

	const booking = await BookingRepository.getBookingById(bookingId)

	if (!isAdmin && booking?.orderingUser != userId) {
		throw new CustomError(
			StatusCodes.UNAUTHORIZED,
			"You are not authorized to access this data"
		)
	}

	return booking
}

export const getBookingDetailById = async (bookingId: string) => {
	const booking = await BookingRepository.getBookingDetailById(bookingId)

	if (!booking) {
		throw new CustomError(
			StatusCodes.NOT_FOUND,
			"Booking data does not exist"
		)
	}

	return booking
}

export const getBookingDetailsByBookingId = async (
	userId: string,
	isAdmin: boolean,
	bookingId: string
) => {
	let user = null
	if (isAdmin) {
		user = await AdminRepository.getAdminById(userId)
	} else {
		user = await UserRepository.getUserById(userId)
	}

	if (!user) {
		throw new CustomError(StatusCodes.UNAUTHORIZED, "User does not exist")
	}

	const booking = await BookingRepository.getBookingById(bookingId)

	if (!booking) {
		throw new CustomError(
			StatusCodes.NOT_FOUND,
			"Booking data does not exist"
		)
	}

	if (!isAdmin && booking?.orderingUser != userId) {
		throw new CustomError(
			StatusCodes.UNAUTHORIZED,
			"You are not authorized to access this data"
		)
	}

	const bookingDetails = await BookingRepository.getBookingDetailsByBookingId(
		bookingId
	)

	return bookingDetails
}

export const getBookingByUserId = async (userId: string) => {
	const bookings = await BookingRepository.getBookingByUserId(userId)

	return bookings
}

export const createBooking = async (
	userId: string,
	bookingData: Array<BookingDetailRequest>
) => {
	const user = await UserRepository.getUserById(userId)

	if (!user) {
		throw new CustomError(StatusCodes.UNAUTHORIZED, "User does not exist")
	}

	if (user.isVerified === false) {
		throw new CustomError(
			StatusCodes.CONFLICT,
			"User is not verified. Please verify your account first to make a booking"
		)
	}

	if (bookingData.length > 5) {
		throw new CustomError(
			StatusCodes.CONFLICT,
			"Exceeded maximum booking limit. Maximum booking is 5 tickets"
		)
	}

	const bookingDate = new Date()
	const deadline = getBookingDeadline()
	const booking = await BookingRepository.createBooking(
		userId,
		bookingData,
		deadline,
		bookingDate
	)

	return booking
}

export const uploadPaymentProof = async (
	userId: string,
	uploadPaymentData: UploadPaymentRequest
) => {
	const booking = await BookingRepository.getBookingById(
		uploadPaymentData.bookingId
	)

	if (!booking) {
		throw new CustomError(StatusCodes.NOT_FOUND, "Booking does not exist")
	}

	if (booking.orderingUser !== userId) {
		throw new CustomError(
			StatusCodes.UNAUTHORIZED,
			"User is not authorized to upload payment proof"
		)
	}

	const now = new Date()
	if (isAfter(now, booking.deadline)) {
		throw new CustomError(
			StatusCodes.CONFLICT,
			"Booking due date has passed"
		)
	}

	if (booking.isActive === false) {
		throw new CustomError(
			StatusCodes.CONFLICT,
			"Booking is already inactive"
		)
	}

	if (booking.paymentProof) {
		throw new CustomError(
			StatusCodes.CONFLICT,
			"Payment proof is already uploaded"
		)
	}

	if (booking.status !== BookingStatus.MENUNGGU_PEMBAYARAN) {
		const message = bookingStatusMessageMapping[booking.status]

		throw new CustomError(
			StatusCodes.CONFLICT,
			`Not accepting payment proof. ${message}`
		)
	}

	const newBooking = await BookingRepository.uploadPaymentProof(
		uploadPaymentData
	)

	return newBooking
}

export const verifyBooking = async (adminId: string, bookingId: string) => {
	const booking = await BookingRepository.getBookingById(bookingId)

	if (!booking) {
		throw new CustomError(StatusCodes.NOT_FOUND, "Booking does not exist")
	}

	if (booking.status != BookingStatus.MENUNGGU_VERIFIKASI) {
		const message = bookingStatusMessageMapping[booking.status]

		throw new CustomError(
			StatusCodes.CONFLICT,
			`Not accepting verification. ${message}`
		)
	}

	const newBooking = await BookingRepository.verifyBooking(adminId, bookingId)

	const bookingDetails = await BookingRepository.getBookingDetailsByBookingId(
		bookingId
	)

	for (const bookingDetail of bookingDetails) {
		sendEmail({
			to: bookingDetail.email,
			type: EmailType.BOOKING_VERIFIED,
			link: `https://www.tedxits.org/dashboard/history/ticket/${bookingDetail.id}`,
		})
	}

	return newBooking
}
