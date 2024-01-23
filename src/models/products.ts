<<<<<<< HEAD
import { ProductsImagesModel } from "./productsImages";
import { ProductsThumbnailImagesModel } from "./productsThumbnailsImages";
import { DataTypes } from "sequelize";
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
} from "../utils/faker";
import { ReviewsModel } from "../models/reviews";
import { CategoriesModel } from "../models/categories";
import { UsersModel } from "../models/users";
import { OrdersModel } from "../models/orders";
import { CartsModel } from "../models/cart";
import { WishlistsModel } from "../models/wishlist";
import { AddressModel } from "../models/address";

=======
import { ProductsImagesModel } from './productsImages';
import { ReviewsModel } from './reviews';
import { DataTypes } from "sequelize";
import dotenv from "dotenv";
import { sequelize } from "../config/database";
import { CategoriesModel } from './categories';
>>>>>>> 9604d9121b9c910101fbf92cb54cbb0c26140a5d
dotenv.config();

export const ProductsModel = sequelize.define("products", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(40),
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: false,
  },
  category: { 
    type: DataTypes.STRING(40),
    allowNull: false,
  },
  Category__Id: {
    type: DataTypes.INTEGER(),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(256),
    allowNull: false,
  },
  finalPrice: DataTypes.DECIMAL(6, 2),

  offer:{
    type:DataTypes.DECIMAL(5,2),
    allowNull:false,
    defaultValue:0,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  alt: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  image_secure_url: {
    type: DataTypes.STRING(128),
    allowNull: true,
  },
<<<<<<< HEAD
});

CategoriesModel.hasMany(ProductsModel, {
  foreignKey: "Category__Id",
  as: "products",
});
ProductsModel.belongsTo(CategoriesModel, {
  foreignKey: "Category__Id",
  as: "productsCategory",
});
ProductsModel.hasMany(ReviewsModel, { foreignKey: "product_id" });
ProductsModel.hasMany(ProductsThumbnailImagesModel, {
  foreignKey: "product_id",
});
ProductsModel.hasMany(ProductsImagesModel, { foreignKey: "product_id" });
ProductsThumbnailImagesModel.belongsTo(ProductsModel, {
  foreignKey: "product_id",
});
ProductsImagesModel.belongsTo(ProductsModel, { foreignKey: "product_id" });
ReviewsModel.belongsTo(ProductsModel, { foreignKey: "product_id" });

sequelize.sync({ force: false });
//*==================

// const fillingTablesCategories = async () => {
//   await CategoriesModel.sync({ force: false });
//   await fillTablesCategories();
// };
// fillingTablesCategories();

// const fillingProductsTables = async () => {
//   await ProductsModel.sync({ force: false });
//   await fillTables();
// };
// fillingProductsTables();
=======
  brand_id :{   
    type: DataTypes.INTEGER,
  },

});

CategoriesModel.hasMany(ProductsModel,{foreignKey:"Category__Id", as: "products"});
ProductsModel.belongsTo(CategoriesModel,{foreignKey:"Category__Id", as: "productsCategory"});
ProductsModel.hasMany(ReviewsModel,{foreignKey:"product_id"});
ProductsModel.hasMany(ProductsImagesModel,{foreignKey:"product_id"});
ProductsImagesModel.belongsTo(ProductsModel,{foreignKey:"product_id"});
ReviewsModel.belongsTo(ProductsModel,{foreignKey:"product_id"});

//sequelize.sync({alter:true});
>>>>>>> 9604d9121b9c910101fbf92cb54cbb0c26140a5d

// const fillingReviewsTables = async () => {
//   await ReviewsModel.sync({ force: false });
//   await fillTablesReviews();
// };
// fillingReviewsTables();

// *====================

// const fillingTablesUsers_ = async () => {
//   await UsersModel.sync({ force: true });
//   await fillingTablesUsers();
// };
// fillingTablesUsers_();

//*===================
// const fillingTablesOrders_ = async () => {
//   await OrdersModel.sync({ force: false });
//   await fillingTablesOrders();
// };
// fillingTablesOrders_();

//*===================

//*===================
// const fillingTablesWithAddresses_ = async () => {
//   await AddressModel.sync({ force: false });
//   await fillingTablesAddresses();
// };
// fillingTablesWithAddresses_();

//*====================
// const fillingTablesWithCarts_ = async () => {
//   await CartsModel.sync({ force: false });
//   await fillingTablesCart();
// };
// fillingTablesWithCarts_();

// const fillingTablesWishLists_ = async () => {
//   await WishlistsModel.sync({ force: false });
//   await filingTablesWishLists();
// };
// fillingTablesWishLists_();
