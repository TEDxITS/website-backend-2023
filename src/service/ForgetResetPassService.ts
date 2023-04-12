import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";

import { CustomError } from "../helper/Error";
import { getUserByEmail, updateUserPasswordById } from "../repository/UserRepository";
import { sendEmail } from "./email";
import { GenerateRandomToken } from "../util/Util";
import { createResetToken, deleteResetTokenById, getResetTokenbyToken, getResetTokenbyUserId, updateResetToken } from "../repository/ForgetPasswordRepository";

export const sendForgetPasswordEmail = async (email: string) => {
    try {
        const user = await getUserByEmail(email)
        
        if(!user) {
            throw new CustomError(StatusCodes.NOT_FOUND, "Email is not Registered")
        }

        const forgetPassword = await getResetTokenbyUserId(user.id);
        
        const resetPassToken = GenerateRandomToken();

        if(forgetPassword) {
            await updateResetToken(user.id, resetPassToken)
        } else {
            await createResetToken(user.id, resetPassToken)
        }

        sendEmail({
            subject: "Your TEDxITS Account Recovery",
            to: email,
            html: `Click <a href="https://www.tedxits.org/reset-password/${resetPassToken}" target="_blank">here</a> to recover your account.`
        })
    } catch(err) {
        throw err;
    }
}

export const resetPassword = async (resetPassToken: string, newPassword: any) => {
    try {
        const data = await getResetTokenbyToken(resetPassToken);
    
        if (!data) {
            throw new CustomError(StatusCodes.NOT_FOUND, "Token is invalid");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
    
        await updateUserPasswordById(data.userId, hashedPassword);
    
        await deleteResetTokenById(data.id);
    } catch(err) {
        throw err;
    }
}