import db from "../config/Db";

export const getResetTokenbyUserId = async (userId: string) => {
    try {
        return await db.forgetPassword.findUnique({
            where: {
                userId
            }
        })
    } catch(err) {
        throw err;
    }
}

export const getResetTokenbyToken = async (token: string) => {
    try {
        return await db.forgetPassword.findUnique({
            where: {
                token
            }
        })
    } catch(err) {
        throw err;
    }
}

export const createResetToken = async (userId: string, token: string) => {
    try {
        await db.forgetPassword.create({
            data: {
                userId,
                token
            }
        })
    } catch(err) {
        throw err;
    }
}

export const updateResetToken = async (userId: string, token: string) => {
    try {
        await db.forgetPassword.update({
            where: {
                userId
            },
            data: {
                token
            }
        })
    } catch(err) {
        throw err;
    }
}

export const deleteResetTokenById = async (id: string) => {
    try {
        await db.forgetPassword.delete({
            where: {
                id
            }
        })
    } catch(err) {
        throw err;
    }
}