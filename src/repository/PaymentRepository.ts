import db from "../config/Db"

export const getAllPayments = async () => {
	return await db.payment.findMany({
		select: {
			id: true,
			name: true,
			personName: true,
			number: true,
		},
	})
}

export const getPaymentById = async (id: string) => {
	return await db.payment.findUnique({
		where: {
			id,
		},
		select: {
			id: true,
			name: true,
			personName: true,
			number: true,
		},
	})
}
