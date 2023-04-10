import { Router } from "express";
import { login, register, loginAdmin, verifyAccount, refreshAdminToken, refreshUserToken } from "../controller/AuthController";

const router = Router()
export default router

router.post('/login', login)
router.post('/register', register);
router.post('/login-admin', loginAdmin)
router.get('/refresh-token', refreshUserToken)
router.get('/admin-refresh-token', refreshAdminToken)
router.get('/verify-account/:verifyToken', verifyAccount);
