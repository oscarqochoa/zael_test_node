
import { config } from 'dotenv';

config();

export const environemnt = {
    dbHost: process.env.DB_HOST,
    dbUsername: process.env.DB_USERNAME,
    dbPassword: process.env.DB_PASSWORD,
    dbDatabase: process.env.DB_DATABASE,
    dbDialect: process.env.DB_DIALECT
};