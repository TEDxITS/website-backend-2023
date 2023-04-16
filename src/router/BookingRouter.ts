import { Router } from "express";
import { AdminAuthMiddleware, UserAuthMiddleware, UserOrAdminAuthMiddleware } from '../middleware/AuthMiddleware';
import { createBooking, getAllBookings, getBookingById, getBookingDetailsByBookingId, getUserBookings, uploadPaymentProof, verifyBooking } from '../controller/BookingController';

const router = Router()
export default router

router.get('/', AdminAuthMiddleware, getAllBookings)
router.get('/:id', UserOrAdminAuthMiddleware, getBookingById)
router.get('/booking-detail/booking/:id', UserOrAdminAuthMiddleware, getBookingDetailsByBookingId)
router.get('/user/:id', UserAuthMiddleware, getUserBookings)
router.post('/', UserAuthMiddleware, createBooking)
router.put('/upload-payment', UserAuthMiddleware, uploadPaymentProof)
router.put('/verify-booking/:id', AdminAuthMiddleware, verifyBooking)
