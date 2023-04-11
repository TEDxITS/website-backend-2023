import { Prisma } from "@prisma/client"
import db from "../config/Db"
import { BookingDetailDataModel, BookingDetailRequest, BookingStatus, UploadPaymentRequest } from "../model/BookingModel"
import { CustomError } from "../helper/Error"
import { StatusCodes } from "http-status-codes"

export const getAllBookings = () => {
    try {
        return db.booking.findMany({
            select: {
                id: true,
                orderingUser: true,
                status: true,
                totalPrice: true,
                paymentProof: true,
                verificator: true,
            }
        })
    } catch(err) {
        throw err
    }
}

export const getBookingById = (id: string) => {
    try {
        return db.booking.findFirst({
            where: {
                id
            },
            select: {
                id: true,
                orderingUser: true,
                status: true,
                totalPrice: true,
                paymentProof: true,
                verificator: true,
            },
        })
    } catch(err) {
        throw err
    }
}

export const getBookingDetailsByBookingId = (bookingId: string) => {
    try {
        return db.bookingDetail.findMany({
            where: {
                bookingId
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
                        price: true,
                    }
                }
            }
        })
    } catch(err) {
        throw err
    }
}

export const getBookingByUserId = (userId: string) => {
    try {
        return db.booking.findMany({
            where: {
                orderingUser: userId
            },
            select: {
                id: true,
                orderingUser: true,
                status: true,
                totalPrice: true,
                paymentProof: true,
                verificator: true,
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
                                price: true,
                            }
                        }
                    }
                }
            }
        })
    } catch(err) {
        throw err
    }
}

export const createBooking = (userId: string, bookingData: Array<BookingDetailRequest>) => {
    try {
        return db.$transaction(async (tx) => {
            // Decrement ticket quota and calculate total price 
            let totalPrice = 0

            try {
                for(const bookingDetail of bookingData) {
                    const {price}: {price: number} = await tx.ticket.update({
                        where: {
                            id: bookingDetail.ticketId
                        },
                        data: {
                            quota: {
                                decrement: 1
                            }
                            },
                        select: {
                            price: true
                        }
                    })
                    totalPrice += price
                }
            } catch(err) {
                if(err instanceof Prisma.PrismaClientUnknownRequestError) {
                    throw new CustomError(StatusCodes.CONFLICT, "Ticket quota is not available")
                }
                throw err
            }
   
            // Create booking
            const booking = await tx.booking.create({
                data: {
                    totalPrice,
                    orderingUser: userId
                },
                select: {
                    id: true,
                    totalPrice: true,
                    status: true,
                    paymentProof: true,
                }
            })

            await tx.bookingDetail.createMany({
                data: (bookingData.map(bookData => {
                    return {
                        bookingId: booking.id,  
                        email: bookData.email,
                        name: bookData.name,
                        phoneNumber: bookData.phoneNumber,
                        ticketId:  bookData.ticketId
                    }
                })) as Array<BookingDetailDataModel>
            })

            return booking
        }, {
            maxWait: 5000,
            timeout: 10000,
        })
    } catch(err) {
        throw err
    }
}

export const uploadPaymentProof = (uploadPaymentData: UploadPaymentRequest) => {
    try {
        return db.booking.update({
            where: {
                id: uploadPaymentData.bookingId
            },
            data: {
                paymentProof: uploadPaymentData.paymentProof,
                status: BookingStatus.MENUNGGU_VERIFIKASI
            },
            select: {
                id: true,
                totalPrice: true,
                status: true,
                paymentProof: true,
            }
        })
    } catch(err) {
        throw err
    }
}

export const verifyBooking = (adminId: string, bookingId: string) => {
    try {
        return db.booking.update({
            where: {
                id: bookingId
            },
            data: {
                status: BookingStatus.TERVERIFIKASI,
                verificator: adminId
            },
            select: {
                id: true,
                totalPrice: true,
                status: true,
                paymentProof: true,
            }
        })
    } catch(err) {
        throw err
    }
}