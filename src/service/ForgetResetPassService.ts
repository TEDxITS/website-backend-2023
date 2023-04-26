import { StatusCodes } from "http-status-codes"
import bcrypt from "bcrypt"

import { CustomError } from "../helper/Error"
import {
	getUserByEmail,
	updateUserPasswordById,
} from "../repository/UserRepository"
import { EmailType, sendEmail } from "../helper/Email"
import { GenerateRandomToken } from "../util/Util"
import {
	createResetToken,
	deleteResetTokenById,
	getResetTokenbyToken,
	getResetTokenbyUserId,
	updateResetToken,
} from "../repository/ForgetPasswordRepository"
import env from "../config/LoadEnv"

export const sendForgetPasswordEmail = async (email: string) => {
	const user = await getUserByEmail(email)

	if (!user) {
		throw new CustomError(StatusCodes.NOT_FOUND, "Email is not Registered")
	}

	const forgetPassword = await getResetTokenbyUserId(user.id)

	const resetPassToken = GenerateRandomToken()

	if (forgetPassword) {
		await updateResetToken(user.id, resetPassToken)
	} else {
		await createResetToken(user.id, resetPassToken)
	}

	sendEmail({
		to: email,
		type: EmailType.FORGET_PASSWORD,
		link: `https://www.tedxits.org/auth/reset-password?token=${resetPassToken}`,
	})
}

export const resetPassword = async (
	resetPassToken: string,
	newPassword: string
) => {
	const data = await getResetTokenbyToken(resetPassToken)

	if (!data) {
		throw new CustomError(StatusCodes.NOT_FOUND, "Token is invalid")
	}

	const hashedPassword = await bcrypt.hash(newPassword, env.HASH_SALT)

	await updateUserPasswordById(data.userId, hashedPassword)

	await deleteResetTokenById(data.id)
}
