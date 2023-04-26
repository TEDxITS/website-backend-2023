import express from "express"
import { EditProfile, getUserInfo } from "../controller/UserController"
import { UserAuthMiddleware } from "../middleware/AuthMiddleware"

const userRouter = express.Router()

userRouter.get("/get-info", UserAuthMiddleware, getUserInfo)
userRouter.patch("/edit-profile", UserAuthMiddleware, EditProfile)

export default userRouter
