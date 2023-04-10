import { Request, Response } from "express";
import db from "../config/Db";
import { sendOk, sendError } from "../helper/ApiResponse";
import { StatusCodes } from "http-status-codes";
import { GenerateRandomToken } from "../util/Util";
import { sendEmail } from "../service/email";

export const forgetPassword = async (req: Request, res: Response) => {
    const account = await db.user.findUnique({
        where: {
            email: req.body.email
        }
    })

    try {
        if ( !account ) {
            return sendError(res, StatusCodes.NOT_FOUND, null, "Email is Not Registered");
        }
    } catch(err) {
        return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, null, "Internal Server Error");
    }
    
    const resetPassToken = GenerateRandomToken();
    db.forgetPassword.create({
        data: {
            userId: account.id,
            token: resetPassToken
        }
    }).then(() => sendEmail({
                subject: "Your TEDxITS Account Password Recovery",
                to: account.email,
                html: "<h1>Greetings, </h1>"
            })
        );

    return sendOk(res, StatusCodes.OK, "Password Recovery Successfully Sent")
    }   