import express from "express";
import dotenv from "dotenv";
import productsRoutes from "./routes/products"
import { ProductsModel } from "./models/products";
import { fillTables } from "./utils/fakter";

const app = express();
dotenv.config();


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

