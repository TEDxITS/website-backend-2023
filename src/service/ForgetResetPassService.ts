import { StatusCodes } from "http-status-codes";
import { CustomError } from "../helper/Error";
import { ForgetPasswordRequest } from "../model/ForgetResetPassModel";
import { getUserByEmail, updateUserPassword } from "../repository/UserRepository";
import { sendEmail } from "./email";
import { GenerateRandomToken } from "../util/Util";
import { createResetToken, deleteResetToken, getResetTokenbyToken } from "../repository/ForgetPasswordRepository";

export const sendForgetPasswordEmail = async (data: ForgetPasswordRequest) => {
    const user = await getUserByEmail(data.email)
    
    if(!user) {
        throw new CustomError(StatusCodes.NOT_FOUND, "Email is not Registered")
    }

    const resetPassToken = await GenerateRandomToken();

    await createResetToken(user.id, resetPassToken).then(() =>
        sendEmail({
            subject: "Your TEDxITS Account Recovery",
            to: data.email,
            html: 'Click <a href="https://www.tedxits.org/reset-password/${resetPassToken}" target="_blank">here</a> to recover your account.'
        })
    );

    return;
}

export const resetPassword = async (resetPassToken: string, newPassword: any) => {
    const data = await getResetTokenbyToken(resetPassToken);

    if(!data){
        throw new CustomError(StatusCodes.NOT_FOUND, "Token is Invalid");
    }

    await updateUserPassword(data.id, newPassword);

    await deleteResetToken(resetPassToken);
}