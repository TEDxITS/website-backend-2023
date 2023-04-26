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

export const getBookingDeadline = () => {
	const now = new Date()

	const todayBeforeOneOclock = new Date(now.valueOf())
	todayBeforeOneOclock.setHours(0, 59, 59, 59)
	const todayAfterFourOclock = new Date(now.valueOf())
	todayAfterFourOclock.setHours(4, 0, 0, 1)

	if (
		isAfter(now, todayBeforeOneOclock) &&
		isBefore(now, todayAfterFourOclock)
	) {
		now.getMinutes() <= 15
			? now.setHours(now.getHours() + 4)
			: now.setHours(now.getHours() + 5)
	} else {
		now.getMinutes() <= 15
			? now.setHours(now.getHours() + 1)
			: now.setHours(now.getHours() + 2)
	}

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
