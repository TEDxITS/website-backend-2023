import { Request, Response } from "express";
import db from "../config/Db";
import bcrypt from "bcrypt";
import { sendError, sendOk } from "../helper/ApiResponse";
import jwt from "jsonwebtoken";
import { UserTokenData } from "../middleware/AuthMiddleware";
import _ from "lodash";

type UpdateBody = {
	name?: string;
	password?: string;
};

export const EditProfile = async (
	req: Request<{}, {}, UpdateBody>,
	res: Response
) => {
	const data = req.body;

	if (_.isEmpty(data)) {
		sendError(res, 400, null, "No update data found");
		return;
	}

	if (!_.has(data, ["name"] || !_.has(data, ["password"]))) {
		sendError(res, 400, null, "Invalid fields");
		return;
	}

	const bearerHeader = req.headers.authorization;

	const token = bearerHeader!.split(" ")[1];

	const { sub } = jwt.decode(token) as UserTokenData;

	try {
		if (data.password) {
			const hashedPassword = await bcrypt.hash(data.password, 12);
			await db.user.update({
				data: { ...data, password: hashedPassword },
				where: { id: sub },
			});
		} else {
			await db.user.update({
				data: { ...data },
				where: { id: sub },
			});
		}
	} catch (error) {
		sendError(res, 500, null, String(error));
		return;
	}

	sendOk(res, 200, "Successfully edited account details");
};
