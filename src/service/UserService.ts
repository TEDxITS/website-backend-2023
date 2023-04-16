import * as bcrypt from "bcrypt";

import env from "../config/LoadEnv";
import * as UserRespository from "../repository/UserRepository";

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
