import express from "express";
import dotenv from "dotenv";
import { sequelize } from "../config/database";
import {
  fillTables,
  fillTablesCategories,
  fillTablesReviews,
  fillingTablesOrders,
  fillingTablesUsers,
  filingTablesWishLists,
  fillingTablesAddresses,
  fillingTablesCart,
  fillBrandTable,
} from "../utils/faker";
import { ProductsModel } from "../models/products";
import { ReviewsModel } from "../models/reviews";
import { CategoriesModel } from "../models/categories";
import { UsersModel } from "../models/users";
import { OrdersModel } from "../models/orders";
import { CartsModel } from "../models/cart";
import { WishlistsModel } from "../models/wishlist";
import { AddressModel } from "../models/address";
import { BrandsModel } from "../models/brands";
const router = express.Router();

router.post("/generate-categories", async (req, res) => {
  try {
    await CategoriesModel.sync({ force: false });
    await fillTablesCategories();
    res.status(200).json({ message: "Categories generated successfully" });
  } catch (error) {
    console.error("Error generating categories:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/generate-products", async (req, res) => {
  try {
    await ProductsModel.sync({ force: false });
    await fillTables();
    res.status(200).json({ message: "Products generated successfully" });
  } catch (error) {
    console.error("Error generating products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/generate-users", async (req, res) => {
  try {
    await UsersModel.sync({ force: false });
    await fillingTablesUsers();
    res.status(200).json({ message: "Users generated successfully" });
  } catch (error) {
    console.error("Error generating users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/generate-reviews", async (req, res) => {
  try {
    await ReviewsModel.sync({ force: false });
    await fillTablesReviews();
    res.status(200).json({ message: "Reviews generated successfully" });
  } catch (error) {
    console.error("Error generating reviews:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/generate-orders", async (req, res) => {
  try {
    await OrdersModel.sync({ force: false });
    await fillingTablesOrders();
    res.status(200).json({ message: "Orders generated successfully" });
  } catch (error) {
    console.error("Error generating orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/generate-wishlists", async (req, res) => {
  try {
    await WishlistsModel.sync({ force: false });
    await filingTablesWishLists();
    res.status(200).json({ message: "Wish Lists generated successfully" });
  } catch (error) {
    console.error("Error generating wish lists:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/generate-cart", async (req, res) => {
  try {
    await CartsModel.sync({ force: false });
    await fillingTablesCart();
    res.status(200).json({ message: "Cart items generated successfully" });
  } catch (error) {
    console.error("Error generating cart items:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/generate-addresses", async (req, res) => {
  try {
    await AddressModel.sync({ force: false });
    await fillingTablesAddresses();
    res.status(200).json({ message: "Addresses generated successfully" });
  } catch (error) {
    console.error("Error generating addresses:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/generate-brands", async (req, res) => {
  try {
    await BrandsModel.sync({ force: false });
    await fillBrandTable();
    res.status(200).json({ message: "Brands generated successfully" });
  } catch (error) {
    console.error("Error generating brands:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
