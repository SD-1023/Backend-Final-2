import express from "express";
import dotenv from "dotenv";
import productsRoutes from "./routes/products";
import reviewsRoutes from "./routes/reviews";
import categoriesRoutes from "./routes/categories";
import { ProductsModel } from "./models/products";;
import { ReviewsModel } from "./models/reviews";
import { fillTables, fillTablesCategories, fillTablesReviews, fillingTablesOrders, fillingTablesUsers } from "./utils/faker";
import { CategoriesModel } from "./models/categories";
import { UsersModel } from "./models/users";
import { OrdersModel } from "./models/orders";

const app = express();
dotenv.config();

app.use(express.json());
app.use("/products",productsRoutes);
app.use("/reviews",reviewsRoutes);
app.use("/categories",categoriesRoutes)


// * Only uncomment this to create a table in your database
// const fillingTables = async ()=>{
//     await ProductsModel.sync({force:true});
//     await fillTables();
    
// }
// fillingTables()

//* Only uncomment this to create a table in your database
// const fillingTables = async ()=>{
//     await ReviewsModel.sync({force:true});
//     await fillTablesReviews();
    
// }
// fillingTables()

// *==================
// const fillingTablesCategories = async () =>{
//     await CategoriesModel.sync({force:true});
//     await fillTablesCategories();
// }
// fillingTablesCategories()

// *==================
// const fillingTablesUsers_ =async() =>{
//     await UsersModel.sync({force:true});
//     await fillingTablesUsers();
// }
// fillingTablesUsers_()

// *===================
// const fillingTablesOrders_ = async () =>{
//     await OrdersModel.sync({force :true});
//     await fillingTablesOrders();
// }
// fillingTablesOrders_();



const PORT = process.env.PORT || 3000;
app.listen(PORT , ()=> console.log(`Server is running in development mode on PORT : ${PORT}`));

