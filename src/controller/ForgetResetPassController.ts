import { Request, Response } from "express";
import { sendError, sendOk } from "../helper/ApiResponse";
import { StatusCodes } from "http-status-codes";
import { forgetPasswordSchema } from "../helper/Validation";
import { ResetPasswordRequest } from "../model/ForgetResetPassModel";
import { CustomError } from "../helper/Error";
import Joi from 'joi';
import { resetPassword, sendForgetPasswordEmail } from "../service/ForgetResetPassService";

export const forgetPassword = async (req: Request, res: Response) => {
    const { error, value }: {error: Joi.ValidationError | undefined, value: ResetPasswordRequest | undefined} = forgetPasswordSchema.validate(req.body, { abortEarly: false });

    if (error) {
		return sendError(res, new CustomError(StatusCodes.BAD_REQUEST, "Wrong Format"), error);
	}
    
    try{
        await sendForgetPasswordEmail(value as ResetPasswordRequest);

        return sendOk(res, StatusCodes.OK, "Email Sent Successfully");
    } catch(err){
        return sendError(res, err);
    }
}

type ResetPassTokenParams = {
	resetPassToken: string;
};

export const resetUserPassword = async (req: Request<ResetPassTokenParams>, res: Response) => {
    const { resetPassToken } = req.params;

    if(!resetPassToken){
        return sendError(res, new CustomError(StatusCodes.BAD_REQUEST, "Token is Required") );
    }

    try{
        const newPassword = req.body.password;
        await resetPassword(resetPassToken, newPassword);

        return sendOk(res,StatusCodes.OK, "Password Changed Successfully")
    } catch(err){
        return sendError(res, err);
    }
}