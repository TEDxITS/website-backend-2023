import { Request, Response } from "express";
import jwt from "jsonwebtoken"
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import _ from "lodash";

import { AdminTokenData, UserTokenData } from "../middleware/AuthMiddleware";
import * as AuthService from "../service/AuthService";
import { sendEmail } from "../service/email";
import env from "../config/LoadEnv";
import db from "../config/Db";
import { sendData, sendError, sendOk } from "../helper/ApiResponse";
import { CustomError } from "../helper/Error";
import { GenerateRandomToken, hasOnly } from "./../util/Util";

// import { GenerateRandomToken } from "./../util/Util";

type RegisterBody = {
	name: string;
	email: string;
	password: string;
};

export const Register = async (
	req: Request<{}, {}, RegisterBody>,
	res: Response
) => {
	try {
		const data = req.body;

		if (!hasOnly(data, ["email", "name", "password"])) {
            sendError(res, new CustomError(StatusCodes.BAD_REQUEST, "Insufficient data to register user"));
			return;
		}

		const oldUser = await db.user.findUnique({
			where: { email: data.email },
		});

		if (oldUser) {
            sendError(res, new CustomError(StatusCodes.CONFLICT, "Someone with that email already exists"), ["email"]);
			return;
		}

		let hashedPassword;

		try {
			hashedPassword = await bcrypt.hash(data.password, 12);
		} catch (error) {
            sendError(res, error, ["password"])
			return;
		}

		const newUser = await db.user.create({
			data: {
				...req.body,
				password: hashedPassword,
				isVerified: false,
			},
		});

		const verifyToken = GenerateRandomToken();
		db.accountVerification
			.create({
				data: { userId: newUser.id, token: verifyToken },
			})
			.then(() =>
				sendEmail({
					subject: "Verify you account for TEDxITS 2023!",
					to: data.email,
					html: `Click <a href="https://www.tedxits.org/verify-account/${verifyToken}" target="_blank">here</a> to verify your account.`,
				})
			);

		sendOk(res, 201, "Successfully registered user");
	} catch (error) {
        sendError(res, error, null)
	}
};

type VerifyAccountParams = {
	verifyToken: string;
};

export const VerifyAccount = async (
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
            const data  = await AuthService.refreshAdminToken(decoded as AdminTokenData)

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
            const data  = await AuthService.refreshUserToken(decoded as UserTokenData)

            sendData(res, StatusCodes.OK, data)
        } catch(err) {
            sendError(res, err)
        }
    })
}
