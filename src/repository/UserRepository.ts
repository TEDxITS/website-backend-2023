
import db from "../config/Db"

export const getUserById = async (userId: string) => {
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
