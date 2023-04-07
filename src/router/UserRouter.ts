import express from "express";
import { EditProfile } from "../controller/UserController";
import { UserAuthMiddleware } from "../middleware/AuthMiddleware";

const userRouter = express.Router();

userRouter.patch("/edit-profile", UserAuthMiddleware, EditProfile);

export default userRouter;
