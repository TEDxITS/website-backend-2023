import { Router } from "express";
import { refreshAdminToken, refreshUserToken } from "../controller/AuthController";

const router = Router()
export default router

router.get('/admin-refresh-token', refreshAdminToken)
router.get('/refresh-token', refreshUserToken)