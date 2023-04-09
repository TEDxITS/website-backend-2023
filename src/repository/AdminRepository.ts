import db from "../config/Db"

export const getAdminById = async (userId: string) => {
    try {
        return db.admin.findUnique({
            where: {
                id: userId
            },
        })
    } catch(err) {
        throw err
    }
}

export const updateAdminRefreshToken = async (userId: string, refreshToken: string) => {
    try { 
        return db.admin.update({
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
