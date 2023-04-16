import db from "../config/Db";

export const getAllPayments = async () => {
	try {
		return await db.payment.findMany({
			select: {
				id: true,
				name: true,
				personName: true,
				number: true,
			}
		});
	} catch (err) {
		throw err;
	}
};

export const getPaymentById = async (id: string) => {
	try {
		return await db.payment.findUnique({
			where: {
				id,
			},
			select: {
				id: true,
				name: true,
				personName: true,
				number: true,
			}
		});
	} catch (err) {
		throw err;
	}
};
