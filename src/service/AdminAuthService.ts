import { StatusCodes } from "http-status-codes"
import bcrypt from "bcrypt"

import { CustomError } from "../helper/Error"
import { AdminTokenData } from "../middleware/AuthMiddleware"
import {
	getAdminByEmail,
	getAdminById,
	updateAdminRefreshToken,
} from "../repository/AdminRepository"
import {
	TokenType,
	generateAccessToken,
	generateRefreshToken,
} from "../helper/JWTToken"
import { LoginRequest } from "../model/AuthModel"

export const login = async (data: LoginRequest) => {
	// Check if user exists
	const admin = await getAdminByEmail(data.email)

	if (!admin) {
		throw new CustomError(StatusCodes.NOT_FOUND, "User does not exist")
	}

	// Compare password
	const isPasswordMatch = bcrypt.compareSync(data.password, admin.password)
	if (!isPasswordMatch) {
		throw new CustomError(
			StatusCodes.UNAUTHORIZED,
			"Email or password invalid"
		)
	}

	const payload = {
		sub: admin.id,
		email: admin.email,
	}
	const accessToken = generateAccessToken(TokenType.ADMIN, payload)
	const refreshToken = generateRefreshToken(TokenType.ADMIN, payload)

	// Update refresh token
	await updateAdminRefreshToken(admin.id, refreshToken)
	const responseData = {
		user: {
			id: admin.id,
			email: admin.email,
		},
		accessToken,
		refreshToken,
	}

	return responseData
}

export const refreshAdminToken = async (userData: AdminTokenData) => {
	const userId = userData.sub

	const admin = await getAdminById(userId)

	if (!admin) {
		throw new CustomError(StatusCodes.NOT_FOUND, "Admin data not found")
	}

	const payload = {
		sub: userId,
		email: userData.email,
	}
	const newAccessToken = generateAccessToken(TokenType.ADMIN, payload)
	const newRefreshToken = generateRefreshToken(TokenType.ADMIN, payload)

	await updateAdminRefreshToken(userId, newRefreshToken)

	const responseData = {
		accessToken: newAccessToken,
		refreshToken: newRefreshToken,
	}

	return responseData
}
