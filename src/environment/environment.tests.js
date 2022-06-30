
import { config } from 'dotenv';

config();

export const environemnt = {
    dbHost: process.env.DB_TEST_HOST,
    dbUsername: process.env.DB_TEST_USERNAME,
    dbPassword: process.env.DB_TEST_PASSWORD,
    dbDatabase: process.env.DB_TEST_DATABASE,
    dbDialect: process.env.DB_TEST_DIALECT
};