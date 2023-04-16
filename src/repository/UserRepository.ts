import db from "../config/Db"

export const getUserById = (userId: string) => {
    try {
        return db.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                name: true,
                email: true,
                isVerified: true,
                password: true,
                refreshToken: true
            }
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

export const updateUserFieldsById = async (userId: string, name: string | undefined, password: string | undefined) => {
    try {
        await db.user.update({
            where: { id: userId },
            data: {
                ...(name && {name}),
                ...(password && {password})
            },
        });
    } catch (error) {
        throw error
    }
}