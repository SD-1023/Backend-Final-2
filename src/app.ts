import express from "express";
import dotenv from "dotenv";
<<<<<<< HEAD
import productsRoutes from "./routes/products"
import { ProductsModel } from "./models/products";
import { fillTables } from "./utils/fakter";
=======
import { DataTypes, Sequelize } from "sequelize";

import productsRoutes from "./routes/products"

import { ProductsModel } from "./models/products";
import { fillTables } from "./utils/faker";
>>>>>>> a552aa9021ca4dadb4698a9c27f49db6934fe328

const app = express();
dotenv.config();

<<<<<<< HEAD

app.use(express.json());

app.use("/products",productsRoutes)
=======
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

app.use("/products",productsRoutes);
>>>>>>> a552aa9021ca4dadb4698a9c27f49db6934fe328


// * Only uncomment this to create a table in your database
// const fillingTables = async ()=>{
//     await ProductsModel.sync({force:true});
//     await fillTables();
    
// }
// fillingTables()

const PORT = process.env.PORT || 3000;
app.listen(PORT , ()=> console.log(`Server is running in development mode on PORT : ${PORT}`));

