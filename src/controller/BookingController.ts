import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import Joi from "joi"

import * as BookingService from "../service/BookingService"
import { sendData, sendError } from "../helper/ApiResponse"
import { AdminToken, UserOrAdminToken, UserToken } from "../middleware/AuthMiddleware"
import { CustomError } from "../helper/Error"
import { createBookingSchema, uploadPaymentSchema, uuidSchema } from "../helper/Validation"
import { BookingDetailRequest, UploadPaymentRequest } from "../model/BookingModel"

export const getAllBookings = async (_: Request, res: Response) => {
    try {
        const bookings = await BookingService.getAllBookings()

        sendData(res, StatusCodes.OK, bookings)
    } catch(err) {
        sendError(res, err)
    }
}

export const getBookingById = async (req: Request, res: Response) => {
    const isAdmin = (req as UserOrAdminToken).isAdmin
    const userId = (req as UserOrAdminToken).user.sub
    const id = req.params.id

    const {error, value: bookingId}: {error: Joi.ValidationError | undefined, value: string | undefined} = uuidSchema.validate(id)
    if(error) {
        sendError(res, new CustomError(StatusCodes.BAD_REQUEST, error.message))
        return
    }

    try {
        const booking = await BookingService.getBookingById(bookingId as string, userId, isAdmin)
        
        sendData(res, StatusCodes.OK, booking)
    } catch(err) {
        console.log("error", err);
        
        sendError(res, err)
    }
}

export const getBookingDetailById = async (req: Request, res: Response) => {
    const id = req.params.id

    const {error, value: bookingId}: {error: Joi.ValidationError | undefined, value: string | undefined} = uuidSchema.validate(id)
    if(error) {
        sendError(res, new CustomError(StatusCodes.BAD_REQUEST, error.message))
        return
    }

    try {
        const booking = await BookingService.getBookingDetailById(bookingId as string)
        
        sendData(res, StatusCodes.OK, booking)
    } catch(err) {
        sendError(res, err)
    }
}

export const getBookingDetailsByBookingId = async (req: Request, res: Response) => {
    const isAdmin = (req as UserOrAdminToken).isAdmin
    const userId = (req as UserOrAdminToken).user.sub
    const id = req.params.id

    const {error, value: bookingId}: {error: Joi.ValidationError | undefined, value: string | undefined} = uuidSchema.validate(id)
    if(error) {
        sendError(res, new CustomError(StatusCodes.BAD_REQUEST, error.message))
        return
    }

    try {
        const booking = await BookingService.getBookingDetailsByBookingId(userId, isAdmin, bookingId as string)
        
        sendData(res, StatusCodes.OK, booking)
    } catch(err) {
        console.log("error", err);
        
        sendError(res, err)
    }
}

export const getUserBookings = async (req: Request, res: Response) => {
    const userId = (req as UserOrAdminToken).user.sub

    try {
        const booking = await BookingService.getBookingByUserId(userId)
        
        sendData(res, StatusCodes.OK, booking)
    } catch(err) {
        sendError(res, err)
    }
}

export const createBooking = async (req: Request, res: Response) => {
    const userId = (req as UserOrAdminToken).user.sub
    const data = req.body as Array<BookingDetailRequest>
    
    const {error, value: bookingData}: {error: Joi.ValidationError | undefined, value: Array<BookingDetailRequest> | undefined} = createBookingSchema.validate(data)
    if(error) {
        sendError(res, new CustomError(StatusCodes.BAD_REQUEST, error.message))
        return
    }

    try {
        const booking = await BookingService.createBooking(userId, bookingData as Array<BookingDetailRequest>)
        
        sendData(res, StatusCodes.OK, booking)
    } catch(err) {
        sendError(res, err)
    }
}

export const uploadPaymentProof = async (req: Request, res: Response) => {
    const userId = (req as UserToken).user.sub
    const data = req.body as UploadPaymentRequest

    const {error, value: uploadPaymentData}: {error: Joi.ValidationError | undefined, value: UploadPaymentRequest | undefined} = uploadPaymentSchema.validate(data)
    if(error) {
        sendError(res, new CustomError(StatusCodes.BAD_REQUEST, error.message))
        return
    }

    try {
        const booking = await BookingService.uploadPaymentProof(userId, uploadPaymentData as UploadPaymentRequest)
        
        sendData(res, StatusCodes.OK, booking)
    } catch(err) {
        sendError(res, err)
    }
}

export const verifyBooking = async (req: Request, res: Response) => {
    const adminId = (req as AdminToken).user.sub
    const bookingId = req.params.id

    if(!bookingId) {
        sendError(res, new CustomError(StatusCodes.BAD_REQUEST, "Id is required"))
        return
    }

    try {
        const booking = await BookingService.verifyBooking(adminId, bookingId)
        
        sendData(res, StatusCodes.OK, booking)
    } catch(err) {
        sendError(res, err)
    }
}
