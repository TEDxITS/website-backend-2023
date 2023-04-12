import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Joi from 'joi';

import { sendError, sendOk } from "../helper/ApiResponse";
import { forgetPasswordSchema, resetPasswordSchema } from "../helper/Validation";
import { ForgetPasswordRequest, ResetPasswordRequest } from "../model/ForgetResetPassModel";
import { CustomError } from "../helper/Error";
import { resetPassword, sendForgetPasswordEmail } from "../service/ForgetResetPassService";

export const forgetPassword = async (req: Request, res: Response) => {
    const { error, value }: {error: Joi.ValidationError | undefined, value: ForgetPasswordRequest | undefined} = forgetPasswordSchema.validate(req.body, { abortEarly: false });

    if (error) {
		sendError(res, new CustomError(StatusCodes.BAD_REQUEST, "Wrong Format"), error);
        return 
	}
    
    try{
        await sendForgetPasswordEmail(value?.email as string);

        sendOk(res, StatusCodes.OK, "Email Sent Successfully");
    } catch(err){
        sendError(res, err);
    }
}

type ResetPassTokenParams = {
	token: string;
};

export const resetUserPassword = async (req: Request<ResetPassTokenParams>, res: Response) => {
    const { error, value }: {error: Joi.ValidationError | undefined, value: ResetPasswordRequest | undefined} = resetPasswordSchema.validate(req.body, { abortEarly: false });

    if (error) {
		sendError(res, new CustomError(StatusCodes.BAD_REQUEST, "Wrong Format"), error);
        return
	}

    const { token: resetPassToken } = req.params;

    if(!resetPassToken){
        sendError(res, new CustomError(StatusCodes.BAD_REQUEST, "Token is Required") );
        return
    }

    try{   
        await resetPassword(resetPassToken, value?.password as string);

        sendOk(res,StatusCodes.OK, "Password Changed Successfully")
    } catch(err){
        sendError(res, err);
    }
}