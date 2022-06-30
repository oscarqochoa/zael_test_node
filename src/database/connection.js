
import { Sequelize } from 'sequelize';
import { env } from "../environment";

export const db = new Sequelize(env.dbDatabase, env.dbUsername, env.dbPassword, {
    host: env.dbHost,
    dialect: env.dbDialect
});