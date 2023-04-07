import db from "../config/Db"
import { UpdateBody } from "../model/UserModel"
import * as bcrypt from 'bcrypt'

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

export const createUser = async (name: string, email: string, password: string) => {
    try {
        return db.user.create({
            data: {
                name,
                email,
                password
            }
        })
    } catch(err) {
        throw err
    }
}

export const createAccountVerification = async (userId: string, token: string) => {
    try {
        return db.accountVerification.create({
            data: {
                userId,
                token
            }
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

export const updateUserPasswordById = async (userId: string, password: string) => {
    try {
        await db.user.update({
            where: {
                id: userId
            },
            data: {
                password
            }
        })
    } catch(err){
        throw err;
    }
}

export const updateUserFieldsById = async (userId: string, data: UpdateBody) => {
    try {
        const hashedPassword =
			data.password && (await bcrypt.hash(data.password, 12));
        await db.user.update({
            data: {
                name: data.name,
                ...(hashedPassword && { password: hashedPassword }),
            },
            where: { id: userId },
        });
    } catch (error) {
        throw error
    }
}