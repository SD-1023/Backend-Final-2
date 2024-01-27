import { fillingTablesCart, fillingTablesOrders, fillingTablesWithOrdersItems } from './../utils/faker';
import { ProductsImagesModel } from "./productsImages";
import { ReviewsModel } from "./reviews";
import { DataTypes } from "sequelize";
import dotenv from "dotenv";
import { sequelize } from "../config/database";
import { CategoriesModel } from "./categories";
import { UsersModel } from "./users";
import { OrdersItemsModel } from "./ordersItems";
import { OrdersModel } from './orders';
import { CartsModel } from './cart';
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

  offer: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  alt: {
    type: DataTypes.STRING(128),
    allowNull: true,
  },
  image_secure_url: {
    type: DataTypes.STRING(128),
    allowNull: true,
  },
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
ProductsModel.hasMany(ProductsImagesModel, { foreignKey: "product_id" });
ProductsImagesModel.belongsTo(ProductsModel, { foreignKey: "product_id" });
ReviewsModel.belongsTo(ProductsModel, { foreignKey: "product_id" });  

UsersModel.hasMany(OrdersModel,{foreignKey:"user_id"});
OrdersModel.belongsTo(UsersModel,{foreignKey:"user_id"});

OrdersItemsModel.belongsTo(OrdersModel,{foreignKey:"order_Id"});
OrdersModel.hasMany(OrdersItemsModel,{foreignKey:"order_Id"});

sequelize.sync({ alter: true });



// const fillingTablesOrders_ = async () =>{
//   await OrdersModel.sync({force:true});
//   await fillingTablesOrders();
// }
// fillingTablesOrders_();

// const fillingTablesOrdersItems_ = async () =>{
//   await OrdersItemsModel.sync({force:true});
//   await fillingTablesWithOrdersItems();
// }
// fillingTablesOrdersItems_();

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
// const fillingTablesWithAddresses_ = async () => {
//   await AddressModel.sync({ force: false });
//   await fillingTablesAddresses();
// };
// fillingTablesWithAddresses_();

//*====================
// const fillingTablesWithCarts_ = async () => {
//   await CartsModel.sync({ force: true });
//   await fillingTablesCart();
// };
// fillingTablesWithCarts_();

// const fillingTablesWishLists_ = async () => {
//   await WishlistsModel.sync({ force: false });
//   await filingTablesWishLists();
// };
// fillingTablesWishLists_();
