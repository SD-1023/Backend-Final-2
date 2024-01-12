import express from "express";
import dotenv from "dotenv";
import { DataTypes, Sequelize } from "sequelize";

import productsRoutes from "./routes/products"
import { ProductsModel } from "./models/products";
import { fillTables } from "./utils/fakter";

const app = express();
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
  


app.use(express.json());

app.use("/products",productsRoutes)


// * Only uncomment this to create a table in your database
// const fillingTables = async ()=>{
//     await ProductsModel.sync({force:true});
//     await fillTables();
    
// }
// fillingTables()

const PORT = process.env.PORT || 3000;
app.listen(PORT , ()=> console.log(`Server is running in development mode on PORT : ${PORT}`));

