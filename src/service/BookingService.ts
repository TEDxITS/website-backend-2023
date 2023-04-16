import * as AdminRepository from '../repository/AdminRepository'
import * as UserRepository from '../repository/UserRepository'
import * as BookingRepository from '../repository/BookingRepository'
import { CustomError } from '../helper/Error'
import { StatusCodes } from 'http-status-codes'
import { BookingDetailRequest, BookingStatus, UploadPaymentRequest } from '../model/BookingModel'
import { getTomorrowDeadline, isAfter } from '../util/Util'
import { EmailType, sendEmail } from '../helper/Email'

export const getAllBookings = async () => {
    try {
        const bookings = await BookingRepository.getAllBookings()
        
        return bookings
    } catch(err) {
        throw err
    }
}

export const getBookingById = async (bookingId: string, userId: string, isAdmin: boolean) => {    
    try {
        let user = null

        if(isAdmin) {
            user = await AdminRepository.getAdminById(userId)
        } else {
            user = await UserRepository.getUserById(userId)
        }

        if(!user) {
            throw new CustomError(StatusCodes.UNAUTHORIZED, "User does not exist")
        }

        const booking = await BookingRepository.getBookingById(bookingId)

        if(!isAdmin && booking?.orderingUser != userId) {
            throw new CustomError(StatusCodes.UNAUTHORIZED, "You are not authorized to access this data")
        }
        
        return booking
    } catch(err) {
        throw err
    }
}

export const getBookingDetailById = async (bookingId: string) => {
    try {
        const booking = await BookingRepository.getBookingDetailById(bookingId)

        if(!booking) {
            throw new CustomError(StatusCodes.NOT_FOUND, "Booking data does not exist")
        }
        
        return booking
    } catch(err) {
        throw err
    }
}

export const getBookingDetailsByBookingId = async (userId: string, isAdmin: boolean, bookingId: string) => {
    try {
        let user = null
        if(isAdmin) {
            user = await AdminRepository.getAdminById(userId)
        } else {
            user = await UserRepository.getUserById(userId)
        }        

        if(!user) {
            throw new CustomError(StatusCodes.UNAUTHORIZED, "User does not exist")
        }

        const booking = await BookingRepository.getBookingById(bookingId)
        
        if(!booking) {
            throw new CustomError(StatusCodes.NOT_FOUND, "Booking data does not exist")
        }

        if(!isAdmin && booking?.orderingUser != userId) {
            throw new CustomError(StatusCodes.UNAUTHORIZED, "You are not authorized to access this data")
        }

        const bookingDetails = await BookingRepository.getBookingDetailsByBookingId(bookingId)
        
        return bookingDetails
    } catch(err) {
        throw err
    }
}

export const getBookingByUserId = async (userId: string) => {
    try {
        const bookings = await BookingRepository.getBookingByUserId(userId)
        
        return bookings
    } catch(err) {
        throw err
    }
}

export const createBooking = async (userId: string, bookingData: Array<BookingDetailRequest>) => {
    try {
        const user = await UserRepository.getUserById(userId)

        if(!user) {
            throw new CustomError(StatusCodes.UNAUTHORIZED, "User does not exist")
        }

        if(user.isVerified === false) {
            throw new CustomError(StatusCodes.CONFLICT, "User is not verified. Please verify your account first to make a booking")
        }

        const bookingDate = new Date()
        const deadline = getTomorrowDeadline()
        const booking = await BookingRepository.createBooking(userId, bookingData, deadline, bookingDate)

        return booking
    } catch(err) {
        throw err
    }
}

export const uploadPaymentProof = async (userId: string, uploadPaymentData: UploadPaymentRequest) => {
    try {
        const booking = await BookingRepository.getBookingById(uploadPaymentData.bookingId)

        if(!booking) {
            throw new CustomError(StatusCodes.NOT_FOUND, "Booking does not exist")
        }

        if(booking.orderingUser !== userId) {
            throw new CustomError(StatusCodes.UNAUTHORIZED, "User is not authorized to upload payment proof")
        }

        const now = new Date()
        if(isAfter(now, booking.deadline)) {
            throw new CustomError(StatusCodes.CONFLICT, "Booking due date has passed")
        }

        if(booking.isActive === false) {
            throw new CustomError(StatusCodes.CONFLICT, "Booking is already inactive")
        }
        
        if(booking.paymentProof) {
            throw new CustomError(StatusCodes.CONFLICT, "Payment proof is already uploaded")
        }

        if(booking.status !== BookingStatus.MENUNGGU_PEMBAYARAN) {
            const currentBookingStatus = booking.status == BookingStatus.MENUNGGU_VERIFIKASI ? "waiting for verification" : "already verified"
            
            throw new CustomError(StatusCodes.CONFLICT, `The booking is not accepting payment proof. It is ${currentBookingStatus}`)
        }

        const newBooking = await BookingRepository.uploadPaymentProof(uploadPaymentData)
        
        return newBooking
    } catch(err) {
        throw err
    }
}

export const verifyBooking = async (adminId: string, bookingId: string) => {
    try {
        const booking = await BookingRepository.getBookingById(bookingId)

        if(!booking) {
            throw new CustomError(StatusCodes.NOT_FOUND, "Booking does not exist")
        }

        if(booking.status != BookingStatus.MENUNGGU_VERIFIKASI) {
            const currentBookingStatus = booking.status == BookingStatus.TERVERIFIKASI ? "already verified" : "waiting for payment upload"

            throw new CustomError(StatusCodes.CONFLICT, `The booking is not accepting verification. It is ${currentBookingStatus}`)
        }

        const newBooking = await BookingRepository.verifyBooking(adminId, bookingId)

        const bookingDetails = await BookingRepository.getBookingDetailsByBookingId(bookingId)

        for(const bookingDetail of bookingDetails) {
            sendEmail({
                to: bookingDetail.email,
                type: EmailType.BOOKING_VERIFIED,
                link: `https://www.tedxits.org/dashboard/history/ticket/${bookingDetail.id}`
            })
        }
        
        return newBooking
    } catch(err) {
        throw err
    }
}