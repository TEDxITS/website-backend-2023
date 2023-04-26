import { Router } from "express"
import {
	AdminAuthMiddleware,
	UserAuthMiddleware,
	UserOrAdminAuthMiddleware,
} from "../middleware/AuthMiddleware"
import {
	createBooking,
	getAllBookings,
	getBookingById,
	getBookingDetailById,
	getBookingDetailsByBookingId,
	getUserBookings,
	uploadPaymentProof,
	verifyBooking,
} from "../controller/BookingController"

const router = Router()
export default router

router.get("/", AdminAuthMiddleware, getAllBookings)
router.get("/user", UserAuthMiddleware, getUserBookings)
router.get("/:id", UserOrAdminAuthMiddleware, getBookingById)
router.get(
	"/booking-detail/booking/:id",
	UserOrAdminAuthMiddleware,
	getBookingDetailsByBookingId
)
router.get("/booking-detail/:id", getBookingDetailById)
router.post("/", UserAuthMiddleware, createBooking)
router.put("/upload-payment", UserAuthMiddleware, uploadPaymentProof)
router.put("/verify-booking/:id", AdminAuthMiddleware, verifyBooking)
