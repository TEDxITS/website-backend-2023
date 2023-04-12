import { Router } from "express";
import { login, register, loginAdmin, verifyAccount, refreshAdminToken, refreshUserToken } from "../controller/AuthController";
import { forgetPassword, resetUserPassword } from "../controller/ForgetResetPassController";

const router = Router()
export default router

router.post('/login', login)
router.post('/register', register);
router.post('/login-admin', loginAdmin)
router.post('/forget-password', forgetPassword)
router.post('/reset-password/:token', resetUserPassword)
router.get('/refresh-token', refreshUserToken)
router.get('/admin-refresh-token', refreshAdminToken)
router.get('/verify-account/:verifyToken', verifyAccount);
