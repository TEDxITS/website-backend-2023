import jwt from "jsonwebtoken"
import env from "../config/LoadEnv"

enum TokenExpiredDuration {
    ACCESS_TOKEN_TIME = "15m",
    REFRESH_TOKEN_TIME = "1d",
}

export const generateJWTToken = (key: string, payload: object, expiredDuration: string) => {
    return jwt.sign(payload, key, { expiresIn: expiredDuration })
}

export const generateAccessToken = (payload: object): string => {
    return generateJWTToken(env.USER_ACCESS_TOKEN_KEY, payload, TokenExpiredDuration.ACCESS_TOKEN_TIME)
}

export const generateRefreshToken = (payload: object): string => {
    return generateJWTToken(env.USER_REFRESH_TOKEN_KEY, payload, TokenExpiredDuration.REFRESH_TOKEN_TIME)
}