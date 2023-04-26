import jwt from "jsonwebtoken"
import env from "../config/LoadEnv"

enum TokenExpiredDuration {
	ACCESS_TOKEN_TIME = "15m",
	REFRESH_TOKEN_TIME = "1d",
}

export enum TokenType {
	USER = "user",
	ADMIN = "admin",
}

export const generateJWTToken = (
	key: string,
	payload: object,
	expiredDuration: string
) => {
	return jwt.sign(payload, key, { expiresIn: expiredDuration })
}

export const generateAccessToken = (
	tokenType: TokenType,
	payload: object
): string => {
	const key =
		tokenType === TokenType.USER
			? env.USER_ACCESS_TOKEN_KEY
			: env.ADMIN_ACCESS_TOKEN_KEY

	return generateJWTToken(
		key,
		payload,
		TokenExpiredDuration.ACCESS_TOKEN_TIME
	)
}

export const generateRefreshToken = (
	tokenType: TokenType,
	payload: object
): string => {
	const key =
		tokenType === TokenType.USER
			? env.USER_REFRESH_TOKEN_KEY
			: env.ADMIN_REFRESH_TOKEN_KEY

	return generateJWTToken(
		key,
		payload,
		TokenExpiredDuration.REFRESH_TOKEN_TIME
	)
}
