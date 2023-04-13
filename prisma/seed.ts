import { tickets } from "./TicketSeed";
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main(){
    for(let ticket of tickets) {
        await db.ticket.create({
            data: ticket
        })
    }
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  })