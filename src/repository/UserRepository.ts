import db from "../config/Db"

export const getUserById = (userId: string) => {
	return db.user.findUnique({
		where: {
			id: userId,
		},
		select: {
			id: true,
			name: true,
			email: true,
			isVerified: true,
			password: true,
			refreshToken: true,
		},
	})
}

export const getUserByEmail = async (email: string) => {
	return db.user.findUnique({
		where: {
			email,
		},
	})
}

export const createUser = async (
	name: string,
	email: string,
	password: string
) => {
	return db.user.create({
		data: {
			name,
			email,
			password,
		},
	})
}

export const createAccountVerification = async (
	userId: string,
	token: string
) => {
	return db.accountVerification.create({
		data: {
			userId,
			token,
		},
	})
}

export const updateUserRefreshToken = async (
	userId: string,
	refreshToken: string
) => {
	return db.user.update({
		where: {
			id: userId,
		},
		data: {
			refreshToken,
		},
	})
}

export const updateUserPasswordById = async (
	userId: string,
	password: string
) => {
	await db.user.update({
		where: {
			id: userId,
		},
		data: {
			password,
		},
	})
}

export const updateUserFieldsById = async (
	userId: string,
	name: string | undefined,
	password: string | undefined
) => {
	await db.user.update({
		where: { id: userId },
		data: {
			...(name && { name }),
			...(password && { password }),
		},
	})
}
