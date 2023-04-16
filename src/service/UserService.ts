import * as bcrypt from "bcrypt";

import env from "../config/LoadEnv";
import * as UserRespository from "../repository/UserRepository";
import { UserInfoResponse } from "../model/UserModel";

export const updateUserFieldsById = async (
	userId: string,
	name: string | undefined,
	password: string | undefined
) => {
	try {
		const hashedPassword = password && (await bcrypt.hash(password, env.HASH_SALT));
			
		await UserRespository.updateUserFieldsById(userId, name, hashedPassword);
	} catch (error) {
		throw error;
	}
};

export const getUserInfoById = async (userId: string) => {
	try {
		const user: UserInfoResponse | null = await UserRespository.getUserById(userId);

		if(!user) {
			throw new Error("User not found");
		}

		delete user["id"]
		delete user["isVerified"]
		delete user["refreshToken"]
		delete user["password"]

		return user;
	} catch(error) {
		throw error;
	}
}
