import db from "../config/Db";

const bcrypt = require("bcryptjs");

export const hashingPassword = async (pass: string, hash: number) => {
        return await bcrypt.hash(pass, hash);
    }

export const findCredentials =async (tokenParam: string) => {
        return await db.forgetPassword.findUnique({
            where: {
                token: tokenParam
            }
        })
    
}