import {config} from "dotenv";

config();

interface Env {
    NODE_ENV: string | undefined;
    PORT: number | undefined;
    DATABASE_URL: string | undefined;
    USER_ACCESS_TOKEN_KEY: string | undefined;
    USER_REFRESH_TOKEN_KEY: string | undefined;
    ADMIN_ACCESS_TOKEN_KEY: string | undefined;
    ADMIN_REFRESH_TOKEN_KEY: string | undefined;
    MAILER_EMAIL: string | undefined;
    MAILER_PASS: string | undefined;
    HASH_SALT: number | undefined;
    ID_TICKET_EARLY_BIRD_WITH_KIT: string | undefined;
    ID_TICKET_PRE_SALE_WITH_KIT: string | undefined;
    ID_TICKET_NORMAL_WITH_KIT: string | undefined;
    ID_TICKET_EARLY_BIRD_NON_KIT: string | undefined;
    ID_TICKET_PRE_SALE_NON_KIT: string | undefined;
    ID_TICKET_NORMAL_NON_KIT: string | undefined;
    ID_PAYMENT_DANA: string | undefined;
    ID_PAYMENT_BNI: string | undefined;
}

interface Config {
    NODE_ENV: string;
    PORT: number;
    DATABASE_URL: string;
    USER_ACCESS_TOKEN_KEY: string;
    USER_REFRESH_TOKEN_KEY: string;
    ADMIN_ACCESS_TOKEN_KEY: string;
    ADMIN_REFRESH_TOKEN_KEY: string;
    MAILER_EMAIL: string;
    MAILER_PASS: string;
    HASH_SALT: number;
    ID_TICKET_EARLY_BIRD_WITH_KIT: string;
    ID_TICKET_PRE_SALE_WITH_KIT: string;
    ID_TICKET_NORMAL_WITH_KIT: string;
    ID_TICKET_EARLY_BIRD_NON_KIT: string;
    ID_TICKET_PRE_SALE_NON_KIT: string;
    ID_TICKET_NORMAL_NON_KIT: string;
    ID_PAYMENT_DANA: string;
    ID_PAYMENT_BNI: string;
}


const getConfig = (): Env => {
    return {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
        DATABASE_URL: process.env.DATABASE_URL,
        USER_ACCESS_TOKEN_KEY: process.env.USER_ACCESS_TOKEN_KEY,
        USER_REFRESH_TOKEN_KEY: process.env.USER_REFRESH_TOKEN_KEY,
        ADMIN_ACCESS_TOKEN_KEY: process.env.ADMIN_ACCESS_TOKEN_KEY,
        ADMIN_REFRESH_TOKEN_KEY: process.env.ADMIN_REFRESH_TOKEN_KEY,
        MAILER_EMAIL: process.env.MAILER_EMAIL,
        MAILER_PASS: process.env.MAILER_PASS,
        HASH_SALT: process.env.HASH_SALT ? Number(process.env.HASH_SALT) : undefined,
        ID_TICKET_EARLY_BIRD_WITH_KIT: process.env.ID_TICKET_EARLY_BIRD_WITH_KIT,
        ID_TICKET_PRE_SALE_WITH_KIT: process.env.ID_TICKET_PRE_SALE_WITH_KIT,
        ID_TICKET_NORMAL_WITH_KIT: process.env.ID_TICKET_NORMAL_WITH_KIT,
        ID_TICKET_EARLY_BIRD_NON_KIT: process.env.ID_TICKET_EARLY_BIRD_NON_KIT,
        ID_TICKET_PRE_SALE_NON_KIT: process.env.ID_TICKET_PRE_SALE_NON_KIT,
        ID_TICKET_NORMAL_NON_KIT: process.env.ID_TICKET_NORMAL_NON_KIT,
        ID_PAYMENT_DANA: process.env.ID_PAYMENT_DANA,
        ID_PAYMENT_BNI: process.env.ID_PAYMENT_BNI,
    };
}

const getSanitizedConfig = (configs: Env): Config => {
    for(const [key, value] of Object.entries(configs)) {
        if(value === undefined) {
            throw new Error(`Environment variable ${key} is not defined`);
        }
    }
    return configs as Config;
}

const realConfig = getConfig();

const env = getSanitizedConfig(realConfig);

export default env