import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize(
    "eCommerceTap",
    process.env.DB_USERNAME as string,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOSTNAME,
      dialect: process.env.DB_DIALECT as 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql',
      port: Number(process.env.DB_PORT),
    }
  );
  