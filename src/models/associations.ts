import { sequelize } from "../config/database";
import { AddressModel } from "./address";
import { CategoriesModel } from "./categories";
import { OrdersModel } from "./orders";
import { OrdersItemsModel } from "./ordersItems";
import { ProductsModel } from "./products";
import { ProductsImagesModel } from "./productsImages";
import { ReviewsModel } from "./reviews";
import { SessionsModel } from "./sessions";
import { UsersModel } from "./users";
import { WishlistsModel } from "./wishlist";

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

UsersModel.hasMany(OrdersModel, { foreignKey: "user_id" });
OrdersModel.belongsTo(UsersModel, { foreignKey: "user_id" });

OrdersItemsModel.belongsTo(OrdersModel, { foreignKey: "order_Id" });
OrdersModel.hasMany(OrdersItemsModel, { foreignKey: "order_Id" });

AddressModel.belongsTo(UsersModel, { foreignKey: "user_id", as: "user" });
UsersModel.hasMany(AddressModel, { foreignKey: "user_id", as: "addresses" });
SessionsModel.belongsTo(UsersModel, { foreignKey: "userId" });

WishlistsModel.belongsTo(ProductsModel,{foreignKey: "product_id"});


//SessionsModel.sync({force:true});
sequelize.sync({ alter: true });
