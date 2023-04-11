import bcrypt from "bcrypt";
import db from "../config/Db"

export const getUserById = (userId: string) => {
    try {
        return db.user.findUnique({
            where: {
                id: userId
            },
        })
    } catch(err) {
        throw err
    }
}

export const getUserByEmail = async (email: string) => {
    try {
        return db.user.findUnique({
            where: {
                email
            },
        })
    } catch(err) {
        throw err
    }
}

export const updateUserRefreshToken = async (userId: string, refreshToken: string) => {
    try { 
        return db.user.update({
            where: {
    
                id: userId
            },
            data: {
                refreshToken
            }
        })
    } catch(err) {
        throw err
    }
}

export const updateUserPassword = async (userId: string, newPassword: string) => {
    try {
        await db.user.update({
            where: {
                id: userId
            },
            data: {
                password: await bcrypt.hash(newPassword, 12)
            }
        })
    } catch(err){
        throw err;
    }
}