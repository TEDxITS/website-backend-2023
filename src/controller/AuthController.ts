import { Request, Response } from "express";
import jwt from "jsonwebtoken"
import { StatusCodes } from "http-status-codes";
import _ from "lodash";
import Joi from 'joi';

import * as AdminAuthService from "../service/AdminAuthService";
import * as UserAuthService from "../service/UserAuthService";
import { AdminTokenData, UserTokenData } from "../middleware/AuthMiddleware";
import env from "../config/LoadEnv";
import db from "../config/Db";
import { sendData, sendError, sendOk } from "../helper/ApiResponse";
import { CustomError, parseJoiErrorObject } from "../helper/Error";
import { loginSchema, registerSchema } from "../helper/Validation";
import { LoginRequest, RegisterRequest } from "../model/AuthModel";

type RegisterBody = {
	name: string;
	email: string;
	password: string;
};

export const login = async (req: Request, res: Response) => {
	const { error, value }: {error: Joi.ValidationError | undefined, value: LoginRequest | undefined} = loginSchema.validate(req.body, { abortEarly: false });

	if (error) {
		sendError(res, new CustomError(StatusCodes.BAD_REQUEST, "Wrong Format"), error);
		return
	}

	try {
		const payload = await UserAuthService.login(value as LoginRequest);

		sendData(res, StatusCodes.OK, payload);
	} catch(err) {
		sendError(res, err)
	}
}

export const loginAdmin = async (req: Request, res: Response) => {
	const { error, value }: {error: Joi.ValidationError | undefined, value: LoginRequest | undefined} = loginSchema.validate(req.body, { abortEarly: false });

	if (error) {
		sendError(res, new CustomError(StatusCodes.BAD_REQUEST, "Wrong Format"), error);
		return
	}

	try {
		const payload = await AdminAuthService.login(value as LoginRequest);

		sendData(res, StatusCodes.OK, payload);
	} catch(err) {
		sendError(res, err)
	}
}


export const register = async (
	req: Request<{}, {}, RegisterBody>,
	res: Response
) => {
	const { error, value }: {error: Joi.ValidationError | undefined, value: RegisterRequest | undefined} = registerSchema.validate(req.body, { abortEarly: false });
	
	if (error) {
		sendError(res, new CustomError(StatusCodes.BAD_REQUEST, "Invalid input"), parseJoiErrorObject(error));
		return
	}

	try {
		await UserAuthService.register(value?.name as string, value?.email as string, value?.password as string);
		
		sendOk(res, 201, "Successfully registered user");
	} catch (error) {
		sendError(res, error)
	}
};

type VerifyAccountParams = {
	verifyToken: string;
};

export const verifyAccount = async (
	req: Request<VerifyAccountParams>,
	res: Response
) => {
	const { verifyToken } = req.params;

	if (!verifyToken) {
        sendError(res, new CustomError(StatusCodes.BAD_REQUEST, "No token found"), ["token"])
		return;
	}
	try {
		let verification;
		try {
			verification = await db.accountVerification.findUniqueOrThrow({
				where: { token: verifyToken },
			});
		} catch (error) {
            sendError(res, new CustomError(StatusCodes.NOT_FOUND, "That token does not exist"), ["token"])
			return;
		}

		await db.user.update({
			data: { isVerified: true },
			where: { id: verification.userId },
		});

		await db.accountVerification.delete({ where: { id: verification.id } });

		sendOk(res, 200, "Successfully verified account");
	} catch (error) {
        sendError(res, error, null)
	}
};

export const refreshAdminToken = (req: Request, res: Response) => {
    const bearerHeader = req.headers.authorization
    if (!bearerHeader || !bearerHeader.startsWith("Bearer ")) {
        sendError(res, new CustomError(StatusCodes.UNAUTHORIZED, "Invalid token"))
        return 
    }

    const token = bearerHeader.split(" ")[1]

    jwt.verify(token, env.ADMIN_REFRESH_TOKEN_KEY, async (err, decoded) => {
        if (err || decoded === undefined) {    
            sendError(res, new CustomError(StatusCodes.UNAUTHORIZED, "Invalid token"))
            return 
        }

        try {
			refreshAdminToken
            const data  = await AdminAuthService.refreshAdminToken(decoded as AdminTokenData)

            sendData(res, StatusCodes.OK, data)
        } catch(err) {
            sendError(res, err)
        }
    })
}

export const refreshUserToken = (req: Request, res: Response) => {
    const bearerHeader = req.headers.authorization
    if (!bearerHeader || !bearerHeader.startsWith("Bearer ")) {
        sendError(res, new CustomError(StatusCodes.UNAUTHORIZED, "Invalid token"))
        return 
    }

    const token = bearerHeader.split(" ")[1]

    jwt.verify(token, env.USER_REFRESH_TOKEN_KEY, async (err, decoded) => {
        if (err || decoded === undefined) {
            
            sendError(res, new CustomError(StatusCodes.UNAUTHORIZED, "Invalid token"))
            return 
        }

        try {
            const data  = await UserAuthService.refreshUserToken(decoded as UserTokenData)

            sendData(res, StatusCodes.OK, data)
        } catch(err) {
            sendError(res, err)
        }
    })
}
