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
import productsImagesRoutes from "./routes/productsImagesRoutes";
import "./models/associations";
import FakerRoute from "./routes/fakerRoutes";
import { ProductsModel } from "./models/products";
import { ReviewsModel } from "./models/reviews";

import { CategoriesModel } from "./models/categories";
import { UsersModel } from "./models/users";
import { OrdersModel } from "./models/orders";
import { CartsModel } from "./models/cart";
import { BrandsModel } from "./models/brands";
import cors from "cors";
import { sequelize } from "./config/database";
import brandsRoutes from "./routes/brands";
import fakerRoutes from "./routes/fakerRoutes";
import { SessionCleanup } from "./utils/sessionCleanup";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

app.use("/faker", fakerRoutes);
app.use("/products", productsRoutes);
app.use("/reviews", reviewsRoutes);
app.use("/categories", categoriesRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/users", usersRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", ordersRoutes);
app.use("/addresses", addressesRoutes);
app.use("/productsImages", productsImagesRoutes);
app.use("/brands", brandsRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(`Server is running in development mode on PORT : ${PORT}`)
);

SessionCleanup();
