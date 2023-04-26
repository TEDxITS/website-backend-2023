import db from "../config/Db"

export const getResetTokenbyUserId = async (userId: string) => {
	return await db.forgetPassword.findUnique({
		where: {
			userId,
		},
	})
}

export const getResetTokenbyToken = async (token: string) => {
	return await db.forgetPassword.findUnique({
		where: {
			token,
		},
	})
}

export const createResetToken = async (userId: string, token: string) => {
	await db.forgetPassword.create({
		data: {
			userId,
			token,
		},
	})
}

export const updateResetToken = async (userId: string, token: string) => {
	await db.forgetPassword.update({
		where: {
			userId,
		},
		data: {
			token,
		},
	})
}

export const deleteResetTokenById = async (id: string) => {
	await db.forgetPassword.delete({
		where: {
			id,
		},
	})
}
