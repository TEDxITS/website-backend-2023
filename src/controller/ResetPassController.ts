import { Request, Response } from "express";
import db from "../config/Db";
import { sendError, sendOk } from "../helper/ApiResponse";
import { StatusCodes } from "http-status-codes";
import { findCredentials, hashingPassword } from "../service/ResetPassService";

export const resetPassword = async (req: Request, res: Response) => {
    const { resetPassToken } = req.params;

    if(!resetPassToken){
        return sendError(res, StatusCodes.PRECONDITION_REQUIRED, null, "No Token is Given");
        
    }

    const resetCredentials  = await findCredentials(resetPassToken);

    if(!resetCredentials){
        return sendError(res, StatusCodes.NOT_FOUND, null, "Token Doesn\'t Exist");
    }

    try {
        const hashedPassword = await hashingPassword(req.body.password, 12);

        await db.user.update({
            data: { password: hashedPassword },
            where: { id: resetCredentials.userId }
        })

        await db.forgetPassword.delete({ where: { id: resetCredentials.id } })

        return sendOk(res, StatusCodes.OK, "Password has been Changed")
    } catch(error) {
        return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, null, "Internal Server Error")
    }
}