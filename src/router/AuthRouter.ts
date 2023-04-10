import { Router } from "express";
import { forgetPassword } from "../controller/ForgetPassController";
import { resetPassword } from "../controller/ResetPassController";

const router = Router()
export default router

router.post('/forget-password', forgetPassword)
router.post('/reset-password/:token', resetPassword)