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