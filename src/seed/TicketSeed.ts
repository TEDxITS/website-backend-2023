import env from "../config/LoadEnv";

export const tickets = [
    {
        id: env.ID_TICKET_EARLY_BIRD_WITH_KIT,
        name: "Early Bird",
        quota: 15,
        price: 115000,
        type: "With Kit",
        dateOpen: new Date("2023-04-20 00:00:00"),
        dateClose: new Date("2023-04-21 23:59:59")
    },
    {
        id: env.ID_TICKET_PRE_SALE_WITH_KIT,
        name: "Pre Sale",
        quota: 15,
        price: 115000,
        type: "With Kit",
        dateOpen: new Date("2023-04-24 00:00:00"),
        dateClose: new Date("2023-04-27 23:59:59")
    },
    {
        id: env.ID_TICKET_NORMAL_WITH_KIT,
        name: "Normal",
        quota: 25,
        price: 135000,
        type: "With Kit",
        dateOpen: new Date("2023-05-02 00:00:00"),
        dateClose: new Date("2023-05-16 23:59:59")
    },
    {
        id: env.ID_TICKET_EARLY_BIRD_NON_KIT,
        name: "Early Bird",
        quota: 30,
        price: 85000,
        type: "Non Kit",
        dateOpen: new Date("2023-04-20 00:00:00"),
        dateClose: new Date("2023-04-21 23:59:59")
    },
    {
        id: env.ID_TICKET_PRE_SALE_NON_KIT,
        name: "Pre Sale",
        quota: 40,
        price: 90000,
        type: "Non Kit",
        dateOpen: new Date("2023-04-24 00:00:00"),
        dateClose: new Date("2023-04-27 23:59:59")
    },
    {
        id: env.ID_TICKET_NORMAL_NON_KIT,
        name: "Normal",
        quota: 55,
        price: 110000,
        type: "Non Kit",
        dateOpen: new Date("2023-05-02 00:00:00"),
        dateClose: new Date("2023-05-16 23:59:59")
    }
]
