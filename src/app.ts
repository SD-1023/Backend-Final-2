import { AddressModel } from './models/address';
import { WishlistsModel } from './models/wishlist';
import express from "express";
import dotenv from "dotenv";
import productsRoutes from "./routes/products";
import reviewsRoutes from "./routes/reviews";
import categoriesRoutes from "./routes/categories";
import wishlistRoutes from "./routes/wishlists";
import usersRoutes from "./routes/users";
import cartRoutes from "./routes/cart";
import ordersRoutes from "./routes/orders";
import addressesRoutes from "./routes/addresses";
import { ProductsModel } from "./models/products";;
import { ReviewsModel } from "./models/reviews";
import { fillTables, fillTablesCategories, fillTablesReviews, fillingTablesOrders, fillingTablesUsers, filingTablesWishLists, fillingTablesAddresses, fillingTablesCart } from "./utils/faker";
import { CategoriesModel } from "./models/categories";
import { UsersModel } from "./models/users";
import { OrdersModel } from "./models/orders";
import { CartsModel } from './models/cart';
import cors from "cors"

const app = express();
dotenv.config();


app.use(cors())
app.use(express.json());
app.use("/products",productsRoutes);
app.use("/reviews",reviewsRoutes);
app.use("/categories",categoriesRoutes);
app.use("/wishlist",wishlistRoutes);
app.use("/users",usersRoutes);
app.use("/cart",cartRoutes);
app.use("/orders",ordersRoutes);
app.use("/addresses",addressesRoutes);



// // * Only uncomment this to create a table in your database
// *======================
// const fillingProductsTables = async ()=>{
//     await ProductsModel.sync({force:true});
//     await fillTables();
    
// }
// fillingProductsTables()

// // *====================
// const fillingReviewsTables = async ()=>{
//     await ReviewsModel.sync({force:true});
//     await fillTablesReviews();
    
// }
// fillingReviewsTables()

// //*==================
// const fillingTablesCategories = async () =>{
//     await CategoriesModel.sync({force:true});
//     await fillTablesCategories();
// }
// fillingTablesCategories()

// //*==================
// const fillingTablesUsers_ =async() =>{
//     await UsersModel.sync({force:true});
//     await fillingTablesUsers();
// }
// fillingTablesUsers_()

// //*===================
// const fillingTablesOrders_ = async () =>{
//     await OrdersModel.sync({force :true});
//     await fillingTablesOrders();
// }
// fillingTablesOrders_();

// //*===================
// const filingTablesWishLists_ = async ()=>{
//     await WishlistsModel.sync({force:true});
//     await filingTablesWishLists();
// }
// filingTablesWishLists_()

// //*===================
// const fillingTablesWithAddresses_ = async()=>{
//     await AddressModel.sync({force:true})
//     await fillingTablesAddresses();
// }
// fillingTablesWithAddresses_()

// //*====================
// const fillingTablesWithCarts_ = async()=>{
//     await CartsModel.sync({force:true})
//     await fillingTablesCart();
// }
// fillingTablesWithCarts_()


const PORT = process.env.PORT || 3000;
app.listen(PORT , ()=> console.log(`Server is running in development mode on PORT : ${PORT}`));

