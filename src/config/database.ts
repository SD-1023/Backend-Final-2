import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_DATABASENAME as string,
    process.env.DB_USERNAME as string,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOSTNAME,
      dialect:'mysql',
      port: Number(process.env.DB_PORT),
    }
);
  
