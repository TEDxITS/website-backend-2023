import env from "../config/LoadEnv";

export const tickets = [
    {
        id: env.ID_TICKET_EARLY_BIRD_WITH_KIT,
        name: "Early Bird",
        quota: 20,
        price: 80000,
        type: "With Kit",
        dateOpen: new Date("2023-04-14 16:00:00"),
        dateClose: new Date("2023-04-15 23:59:00")
    },
    {
        id: env.ID_TICKET_PRE_SALE_WITH_KIT,
        name: "Early Bird",
        quota: 20,
        price: 80000,
        type: "With Kit",
        dateOpen: new Date("2023-04-14 16:00:00"),
        dateClose: new Date("2023-04-15 23:59:00")
    },
    {
        id: env.ID_TICKET_NORMAL_WITH_KIT,
        name: "Normal",
        quota: 55,
        price: 110000,
        type: "With Kit",
        dateOpen: new Date("2023-05-02T16:00:00"),
        dateClose: new Date("2023-05-16T23:59:00")
    },
    {
        id: env.ID_TICKET_EARLY_BIRD_NON_KIT,
        name: "Early Bird",
        quota: 10,
        price: 105000,
        type: "Non Kit",
        dateOpen: new Date("2023-04-14 16:00:00"),
        dateClose: new Date("2023-04-15 23:59:00")
    },
    {
        id: env.ID_TICKET_PRE_SALE_NON_KIT,
        name: "Pre Sale",
        quota: 15,
        price: 115000,
        type: "Non Kit",
        dateOpen: new Date("2023-04-24T16:00:00"),
        dateClose: new Date("2023-04-27T23:59:00")
    },
    {
        id: env.ID_TICKET_NORMAL_NON_KIT,
        name: "Normal",
        quota: 25,
        price: 135000,
        type: "Non Kit",
        dateOpen: new Date("2023-05-02T16:00:00"),
        dateClose: new Date("2023-05-16T23:59:00")
    }
]
