import db from "../config/Db"

export const updateAdminRefreshToken = async (userId: string, refreshToken: string) => {
    return db.user.update({
        where: {

            id: userId
        },
        data: {
            refreshToken
        }
    })
}

export const updateUserRefreshToken = async (userId: string, refreshToken: string) => {
    return db.user.update({
        where: {
            id: userId
        },
        data: {
            refreshToken
        }
    })
}