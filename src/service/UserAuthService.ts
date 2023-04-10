import { StatusCodes } from "http-status-codes"
import bcrypt from "bcrypt";

import { CustomError } from "../helper/Error"
import { UserTokenData } from "../middleware/AuthMiddleware"
import { getUserByEmail, getUserById, updateUserRefreshToken } from "../repository/UserRepository"
import { TokenType, generateAccessToken, generateRefreshToken } from "../helper/JWTToken"
import { LoginRequest } from "../model/AuthModel"

export const login = async (data: LoginRequest) => {
    // Check if user exists
    const user = await getUserByEmail(data.email)
    
    if(!user) {
        throw new CustomError(StatusCodes.NOT_FOUND, "User does not exist")
    }
    
	// Compare password
    const isPasswordMatch = bcrypt.compareSync(data.password, user.password)
    if(!isPasswordMatch) {
        throw new CustomError(StatusCodes.UNAUTHORIZED, "Email or password invalid")
    }
    
    const payload = {
        sub: user.id,
        email: user.email,
        name: user.name
    }
    const accessToken = generateAccessToken(TokenType.USER, payload)
    const refreshToken = generateRefreshToken(TokenType.USER, payload)
    
    // Update refresh token
    await updateUserRefreshToken(user.id, refreshToken)

    const responseData = {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
        },
        accessToken,
        refreshToken
    }

    return responseData
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