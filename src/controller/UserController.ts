import { Request, Response } from "express";
import { sendData, sendError, sendOk } from "../helper/ApiResponse";
import { UserToken, UserTokenData } from "../middleware/AuthMiddleware";
import _ from "lodash";
import { UpdateBody } from "../model/UserModel";
import { CustomError, parseJoiErrorObject } from "../helper/Error";
import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import { editProfileSchema } from "../helper/Validation";
import * as UserService from "../service/UserService";

export const EditProfile = async (
	req: Request<{}, { user: UserTokenData }, UpdateBody>,
	res: Response
) => {
	const {
		error,
		value,
	}: {
		error: Joi.ValidationError | undefined;
		value: UpdateBody | undefined;
	} = editProfileSchema.validate(req.body, { abortEarly: false });

	if (error) {
		sendError(
			res,
			new CustomError(StatusCodes.BAD_REQUEST, "Wrong Format"),
			parseJoiErrorObject(error)
		);
		return;
	}

	const userId = (req as UserToken).user.sub;

	try {
		await UserService.updateUserFieldsById(userId, value?.name, value?.password);
	} catch (error) {
		sendError(res, error);
		return;
	}

	sendOk(res, 200, "Successfully edited account details");
};

export const getUserInfo = async (req: Request, res: Response) => {
	const userId = (req as UserToken).user.sub;

	try {
		const user = await UserService.getUserInfoById(userId);

		sendData(res, StatusCodes.OK, user);
	} catch(error) {
		sendError(res, error)
	}
};