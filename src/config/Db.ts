import { PrismaClient } from "@prisma/client"

declare global {
	// eslint-disable-next-line no-var
	var __db: PrismaClient | undefined
}

if (!global.__db) {
	global.__db = new PrismaClient()
}

const db: PrismaClient = global.__db

export default db
