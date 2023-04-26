import db from "../config/Db"
import { tickets } from "./TicketSeed"
import { payments } from "./PaymentSeed"

async function main() {
	try {
		tickets.forEach(async (ticket) => {
			await db.ticket.upsert({
				where: {
					id: ticket.id,
				},
				update: {
					id: ticket.id,
					name: ticket.name,
					quota: ticket.quota,
					price: ticket.price,
					type: ticket.type,
					dateOpen: ticket.dateOpen,
					dateClose: ticket.dateClose,
				},
				create: {
					id: ticket.id,
					name: ticket.name,
					quota: ticket.quota,
					price: ticket.price,
					type: ticket.type,
					dateOpen: ticket.dateOpen,
					dateClose: ticket.dateClose,
				},
			})
		})

		payments.forEach(async (payment) => {
			await db.payment.upsert({
				where: {
					id: payment.id,
				},
				update: {
					id: payment.id,
					name: payment.name,
					personName: payment.personName,
					number: payment.number,
				},
				create: {
					id: payment.id,
					name: payment.name,
					personName: payment.personName,
					number: payment.number,
				},
			})
		})
	} catch (error) {
		console.error(error)
		process.exit(1)
	}
}

main()
