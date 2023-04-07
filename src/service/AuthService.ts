import { TokenType, generateAccessToken, generateRefreshToken } from "../helper/JWTToken"
import { AdminTokenData, UserTokenData } from "../middleware/AuthMiddleware"
import { updateAdminRefreshToken, updateUserRefreshToken } from "../repository/AuthRepository"

export const refreshAdminToken = async (user: AdminTokenData) => {
    const userId = user.sub
    const payload = {
        sub: userId,
        email: user.email
    }
    const newAccessToken = generateAccessToken(TokenType.ADMIN, payload)
    const newRefreshToken = generateRefreshToken(TokenType.ADMIN, payload)

    try {
        await updateAdminRefreshToken(userId, newRefreshToken)

        const responseData = {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        }

        return responseData
    } catch(err) {
        throw new Error("Error while updating refresh token")
    }
}

export const refreshUserToken = async (user: UserTokenData) => {
    const userId = user.sub
    const payload = {
        sub: userId,
        email: user.email,
        name: user.name
    }
    const newAccessToken = generateAccessToken(TokenType.USER, payload)
    const newRefreshToken = generateRefreshToken(TokenType.USER, payload)

    try {
        await updateUserRefreshToken(userId, newRefreshToken)

        const responseData = {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        }

        return responseData
    } catch(err) {
        throw new Error("Update refresh token failed")
    }
}
