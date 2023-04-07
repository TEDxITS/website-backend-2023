import { Router } from "express";
import { Register, VerifyAccount, refreshAdminToken, refreshUserToken } from "../controller/AuthController";

const router = Router()
export default router

router.get('/admin-refresh-token', refreshAdminToken)
router.get('/refresh-token', refreshUserToken)
router.post('/register', Register);
router.get('/verifyAccount/:verifyToken', VerifyAccount);
