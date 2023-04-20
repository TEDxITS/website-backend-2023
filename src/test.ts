import db from "./config/Db";
import { EmailType, sendEmail } from "./helper/Email";

async function main() {
    // SEND EMAIL
    const books = await db.booking.findMany({
        where: {
            status: 'MENUNGGU_PEMBAYARAN',
            isActive: true,
        },
        select: {
            user: {
                select: {
                    email: true,
                    name: true
                }
            }
        }
    })

    for(const book of books) {
        sendEmail({
            name: book.user.name,
            type: EmailType.DEADLINE,
            to: book.user.email
        })
    }

    // CHANGE DEADLINE DB
    await db.booking.updateMany({
        where: {
            status: 'MENUNGGU_PEMBAYARAN',
            isActive: true,
        },
        data: {
            deadline: new Date("2023-04-20 21:00:00"),
        }
    })
}

main()