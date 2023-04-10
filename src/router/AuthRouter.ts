import { Router } from "express";
<<<<<<< HEAD
import { login, register, loginAdmin, verifyAccount, refreshAdminToken, refreshUserToken } from "../controller/AuthController";
=======
import { forgetPassword } from "../controller/ForgetPassController";
import { resetPassword } from "../controller/ResetPassController";
>>>>>>> 9ce2765 (feat: add forget and reset password feature)

const router = Router()
export default router

<<<<<<< HEAD
router.post('/login', login)
router.post('/register', register);
router.post('/login-admin', loginAdmin)
router.get('/refresh-token', refreshUserToken)
router.get('/admin-refresh-token', refreshAdminToken)
router.get('/verify-account/:verifyToken', verifyAccount);
=======
router.post('/forget-password', forgetPassword)
router.post('/reset-password/:token', resetPassword)
>>>>>>> 9ce2765 (feat: add forget and reset password feature)
