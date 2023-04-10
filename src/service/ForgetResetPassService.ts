import { StatusCodes } from "http-status-codes";
import db from "../config/Db";
import { CustomError } from "../helper/Error";
import { ResetPasswordRequest } from "../model/ForgetResetPassModel";
import { getUserByEmail } from "../repository/UserRepository";
import { sendEmail } from "./email";
import { GenerateRandomToken } from "../util/Util";

const bcrypt = require("bcryptjs");

export const sendForgetPasswordEmail = async (data: ResetPasswordRequest) => {
    const user = await getUserByEmail(data.email)
    
    if(!user) {
        throw new CustomError(StatusCodes.NOT_FOUND, "Email is not Registered")
    }

    const ResetPassToken = GenerateRandomToken();

    await db.forgetPassword.create({
        data: {
            userId: user.id,
            token: ResetPassToken
        }
    })

    await sendEmail({
        subject: "Your TEDxITS Account Recovery",
        to: data.email,
        html: 'Click <a href="https://www.tedxits.org/reset-password//${ResetPassToken}" target="_blank">here</a> to recover your account.'
    });

    return;
}

export const resetPassword = async (resetPassToken: string, newPassword: string) => {
    const Token = await db.forgetPassword.findUnique({
        where: {
            token: resetPassToken
        }
    })

    if(!Token){
        throw new CustomError(StatusCodes.NOT_FOUND, "Token is Invalid");
    }

    await db.user.update({
        where: {
            id: Token.userId
        },
        data: {
            password: await bcrypt.hash(newPassword, 12)
        }
    })

    return;
}