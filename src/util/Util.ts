import crypto from "crypto"

export const GenerateRandomToken = (): string => {
	return crypto.randomBytes(16).toString("hex")
}

export const isAfter = (dateA: Date, dateB: Date): boolean => {
	return dateA.getTime() > dateB.getTime()
}

export const isBefore = (dateA: Date, dateB: Date): boolean => {
	return dateA.getTime() < dateB.getTime()
}

export const getTomorrowDeadline = () => {
	const now = new Date()

	now.setDate(now.getDate() + 1)
	now.setHours(now.getHours() + 1)
	now.setMinutes(0)
	now.setSeconds(0)
	now.setMilliseconds(0)

	return now
}

export function exclude<T, Key extends keyof T = keyof T>(
	user: T,
	keys: Key[]
): Omit<T, Key> {
	for (const key of keys) {
		delete user[key]
	}
	return user
}
