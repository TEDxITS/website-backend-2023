import db from "../config/Db";

export const getResetTokenbyToken =async (token: string) => {
    try {
        return await db.forgetPassword.findUnique({
            where: {
                token: token
            }
        })
    } catch(err){
        throw err;
    }
}

export const createResetToken = async (userId: string, token: string) => {
    try {
        await db.forgetPassword.create({
            data: {
                userId: userId,
                token: token
            }
        })
    } catch(err){
        throw err;
    }
}

export const deleteResetToken = async (token: string) => {
    try {
        await db.forgetPassword.delete({
            where: {
                token: token
            }
        })
    } catch(err) {
        throw err;
    }
}