import { AddressModel } from "./models/address";
import { WishlistsModel } from "./models/wishlist";
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
import productsThumbnailsRoutes from "./routes/productsThumbnailImages";
import productsImagesRoutes from "./routes/productsImagesRoutes";
import FakerRoute from "./routes/fakerRoutes";
import { ProductsModel } from "./models/products";
import { ReviewsModel } from "./models/reviews";

import { CategoriesModel } from "./models/categories";
import { UsersModel } from "./models/users";
import { OrdersModel } from "./models/orders";
import { CartsModel } from "./models/cart";
import cors from "cors";
import { sequelize } from "./config/database";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log(
//       "Connection to the database has been established successfully."
//     );
//   })
//   .catch((err) => {
//     console.error("Unable to connect to the database:", err);
//   });

// sequelize
//   .sync({ force: true })
//   .then(() => {
//     console.log("Database synced");
//   })
//   .catch((err) => {
//     console.log("Error syncing the database", err);
//   });

app.use("/faker", FakerRoute);
app.use("/products", productsRoutes);
app.use("/reviews", reviewsRoutes);
app.use("/categories", categoriesRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/users", usersRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", ordersRoutes);
app.use("/addresses", addressesRoutes);
app.use("/productsThumbnails", productsThumbnailsRoutes);
app.use("/productsImages", productsImagesRoutes);

// * Only uncomment this to create a table in your database

const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(`Server is running in development mode on PORT : ${PORT}`)
);
