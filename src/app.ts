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
import { ProductsModel } from "./models/products";
import { ReviewsModel } from "./models/reviews";
import {
  fillTables,
  fillTablesCategories,
  fillTablesReviews,
  fillingTablesOrders,
  fillingTablesUsers,
  filingTablesWishLists,
} from "./utils/faker";
import { CategoriesModel } from "./models/categories";
import { UsersModel } from "./models/users";
import { OrdersModel } from "./models/orders";
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

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database synced");
  })
  .catch((err) => {
    console.log("Error syncing the database", err);
  });

const fillingTablesProduct_ = async () => {
  await ProductsModel.sync({ force: false });
  await fillTables();
};
fillingTablesProduct_();

// const fillingTablesOrders_ = async () => {
//   await OrdersModel.sync({ force: true });
//   await fillingTablesOrders();
// };
// fillingTablesOrders_();

// const fillingReviewsTables = async () => {
//   await ReviewsModel.sync({ force: true });
//   await fillTablesReviews();
// };
// fillingReviewsTables();

// const fillingTablesCategories = async () => {
//   await CategoriesModel.sync({ force: true });
//   await fillTablesCategories();
// };
// fillingTablesCategories();

// const fillingTablesUsers_ = async () => {
//   await UsersModel.sync({ force: true });
//   await fillingTablesUsers();
// };
// fillingTablesUsers_();

// const filingTablesWishLists_ = async () => {
//   await WishlistsModel.sync({ force: true });
//   await filingTablesWishLists();
// };
// filingTablesWishLists_();

app.use(express.json());
app.use("/products", productsRoutes);
app.use("/reviews", reviewsRoutes);
app.use("/categories", categoriesRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(`Server is running in development mode on PORT : ${PORT}`)
);
