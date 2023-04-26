import db from "../config/Db"

export const getAdminById = async (userId: string) => {
	return db.admin.findUnique({
		where: {
			id: userId,
		},
	})
}

export const getAdminByEmail = async (email: string) => {
	return db.admin.findUnique({
		where: {
			email,
		},
	})
}

export const updateAdminRefreshToken = async (
	userId: string,
	refreshToken: string
) => {
	return db.admin.update({
		where: {
			id: userId,
		},
		data: {
			refreshToken,
		},
	})
}
