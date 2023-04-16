import { UpdateBody } from "../model/UserModel";
import * as bcrypt from "bcrypt";
import * as UserRespository from "../repository/UserRepository";

export const updateUserFieldsById = async (
	userId: string,
	data: UpdateBody
) => {
	try {
		const hashedPassword =
			data.password && (await bcrypt.hash(data.password, 12));
		await UserRespository.updateUserFieldsById(userId, {
			name: data.name,
			...(hashedPassword && { password: hashedPassword }),
		});
	} catch (error) {
		throw error;
	}
};
