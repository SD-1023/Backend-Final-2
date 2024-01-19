import express from "express";
import dotenv from "dotenv";
import productsRoutes from "./routes/products";
import reviewsRoutes from "./routes/reviews";
import categoriesRoutes from "./routes/categories";
import brandsRoutes from "./routes/brands"
import { ProductsModel } from "./models/products";;
import { ReviewsModel } from "./models/reviews";
import { fillTables, fillTablesCategories, fillTablesReviews, fillingTablesOrders, fillingTablesUsers ,fillTablesBrands} from "./utils/faker";
import { CategoriesModel } from "./models/categories";
import { UsersModel } from "./models/users";
import { OrdersModel } from "./models/orders";
import { BrandsModel } from "./models/brands";

import { sequelize } from "./config/database";

const app = express();
dotenv.config();


sequelize
  .authenticate()
  .then(() => {
    console.log(
      "Connection to the database has been established successfully."
    );
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// sequelize
//   .sync({ force: true })
//   .then(() => {
//     console.log("Database synced");
//   })
//   .catch((err) => {
//     console.log("Error syncing the database", err);
//   }); 

app.use(express.json());
app.use("/products",productsRoutes);
app.use("/reviews",reviewsRoutes);
app.use("/categories",categoriesRoutes);
app.use("/brands",brandsRoutes)




// const fillingTables = async ()=>{
//    await BrandsModel.sync({force:true});
//    await fillTablesBrands();
    
//  }
// fillingTables()

// * Only uncomment this to create a table in your database
// const fillingTables = async ()=>{
    //await ProductsModel.sync({force:true});
//    await fillTables();
    
//  }
// fillingTables()

//* Only uncomment this to create a table in your database
// const fillingTables = async ()=>{
//  await fillTablesReviews();
//     }
//  fillingTables()

// *==================
// const fillingTablesCategories = async () =>{
//    await fillTablesCategories();
//  }
//  fillingTablesCategories();

// *==================
// const fillingTablesUsers_ =async() =>{
//      await UsersModel.sync({force:true});
//     await fillingTablesUsers();
// }
// fillingTablesUsers_()

// *===================
// const fillingTablesOrders_ = async () =>{
//      await OrdersModel.sync({force:true});
//     await fillingTablesOrders();
// }
// fillingTablesOrders_();



const PORT = process.env.PORT || 3000;
app.listen(PORT , ()=> console.log(`Server is running in development mode on PORT : ${PORT}`));

