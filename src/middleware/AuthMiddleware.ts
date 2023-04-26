import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import jwt from "jsonwebtoken"

import env from "../config/LoadEnv"
import { sendError } from "../helper/ApiResponse"
import { CustomError } from "../helper/Error"

export interface UserTokenData extends jwt.JwtPayload {
	sub: string
	email: string
	name: string
}

export interface UserToken extends Request {
	user: UserTokenData
}

export interface AdminTokenData extends jwt.JwtPayload {
	sub: string
	email: string
}

export interface AdminToken extends Request {
	user: AdminTokenData
}

export interface UserOrAdminToken extends Request {
	user: AdminTokenData | UserTokenData
	isAdmin: boolean
}

export const UserAuthMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.log("user middleware")

	const bearerHeader = req.headers.authorization
	if (!bearerHeader || !bearerHeader.startsWith("Bearer ")) {
		sendError(
			res,
			new CustomError(StatusCodes.UNAUTHORIZED, "Invalid token")
		)
		return
	}

	const token = bearerHeader.split(" ")[1]

	jwt.verify(token, env.USER_ACCESS_TOKEN_KEY, (err, decoded) => {
		if (err || decoded === undefined) {
			sendError(
				res,
				new CustomError(StatusCodes.UNAUTHORIZED, "Invalid token")
			)
			return
		}

		;(req as UserToken).user = decoded as UserTokenData

		next()
	})
}

export const AdminAuthMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const bearerHeader = req.headers.authorization
	if (!bearerHeader || !bearerHeader.startsWith("Bearer ")) {
		sendError(
			res,
			new CustomError(StatusCodes.UNAUTHORIZED, "Invalid token")
		)
		return
	}

	const token = bearerHeader.split(" ")[1]

	jwt.verify(token, env.ADMIN_ACCESS_TOKEN_KEY, (err, decoded) => {
		if (err || decoded === undefined) {
			sendError(
				res,
				new CustomError(StatusCodes.UNAUTHORIZED, "Invalid token")
			)
			return
		}

		;(req as AdminToken).user = decoded as AdminTokenData

		next()
	})
}

export const UserOrAdminAuthMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const bearerHeader = req.headers.authorization
	if (!bearerHeader || !bearerHeader.startsWith("Bearer ")) {
		sendError(
			res,
			new CustomError(StatusCodes.UNAUTHORIZED, "Invalid token")
		)
		return
	}

	const token = bearerHeader.split(" ")[1]

	try {
		const decoded = jwt.verify(
			token,
			env.USER_ACCESS_TOKEN_KEY
		) as UserTokenData

		;(req as UserOrAdminToken).user = decoded as UserTokenData
		;(req as UserOrAdminToken).isAdmin = false

		next()
	} catch (err) {
		try {
			const decoded = jwt.verify(
				token,
				env.ADMIN_ACCESS_TOKEN_KEY
			) as AdminTokenData

			;(req as UserOrAdminToken).user = decoded as UserTokenData
			;(req as UserOrAdminToken).isAdmin = true

			next()
		} catch (err) {
			sendError(
				res,
				new CustomError(StatusCodes.UNAUTHORIZED, "Invalid token")
			)
			return
		}
	}
}
