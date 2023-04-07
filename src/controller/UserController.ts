import { Request, Response } from "express";
import { sendError, sendOk } from "../helper/ApiResponse";
import { UserToken, UserTokenData } from "../middleware/AuthMiddleware";
import _ from "lodash";
import { UpdateBody } from "../model/UserModel";
import { CustomError } from "../helper/Error";
import { StatusCodes } from "http-status-codes";
import { updateUserFieldsById } from "../repository/UserRepository";

export const EditProfile = async (
	req: Request<{}, { user: UserTokenData }, UpdateBody>,
	res: Response
) => {
	const data = req.body;

	if (_.isEmpty(data)) {
		sendError(
			res,
			new CustomError(StatusCodes.BAD_REQUEST, "Insufficient Data")
		);
		return;
	}

	const sub = (req as UserToken).user.sub;

	try {
		await updateUserFieldsById(sub, data);
	} catch (error) {
		sendError(res, error);
		return;
	}

	sendOk(res, 200, "Successfully edited account details");
};
