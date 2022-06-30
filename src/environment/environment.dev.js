
import { config } from 'dotenv';

config();

export const environemnt = {
    dbHost: process.env.DB_DEV_HOST,
    dbUsername: process.env.DB_DEV_USERNAME,
    dbPassword: process.env.DB_DEV_PASSWORD,
    dbDatabase: process.env.DB_DEV_DATABASE,
    dbDialect: process.env.DB_DEV_DIALECT
};