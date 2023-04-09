import { StatusCodes } from "http-status-codes"
import { CustomError } from "../helper/Error"
import { TokenType, generateAccessToken, generateRefreshToken } from "../helper/JWTToken"
import { AdminTokenData, UserTokenData } from "../middleware/AuthMiddleware"
import { getAdminById, updateAdminRefreshToken } from "../repository/AdminRepository"
import { getUserById, updateUserRefreshToken } from "../repository/UserRepository"

export const refreshAdminToken = async (userData: AdminTokenData) => {
    try {
        const userId = userData.sub

        const admin = await getAdminById(userId)
        
        if (!admin) {
            throw new CustomError(StatusCodes.NOT_FOUND, "Admin data not found")
        }

        const payload = {
            sub: userId,
            email: userData.email
        }
        const newAccessToken = generateAccessToken(TokenType.ADMIN, payload)
        const newRefreshToken = generateRefreshToken(TokenType.ADMIN, payload)

        await updateAdminRefreshToken(userId, newRefreshToken)

        const responseData = {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        }

        return responseData
    } catch(err) {
        throw err
    }
}

export const refreshUserToken = async (userData: UserTokenData) => {
    try {
        const userId = userData.sub

        const user = await getUserById(userId)
        
        if (!user) {
            throw new CustomError(StatusCodes.NOT_FOUND, "User data not found")
        }

        const payload = {
            sub: userId,
            email: userData.email,
            name: userData.name
        }
        const newAccessToken = generateAccessToken(TokenType.USER, payload)
        const newRefreshToken = generateRefreshToken(TokenType.USER, payload)

        await updateUserRefreshToken(userId, newRefreshToken)

        const responseData = {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        }

        return responseData
    } catch(err) {
        throw err
    }
}
