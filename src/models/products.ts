import { ProductsImagesModel } from './productsImages';
import { ProductsThumbnailImagesModel } from './productsThumbnailsImages';
import { ReviewsModel } from './reviews';
import { DataTypes } from "sequelize";
import dotenv from "dotenv";
import { sequelize } from "../config/database";
import { CategoriesModel } from "./categories";

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
  Category__Id :{
    type:DataTypes.INTEGER(),
    allowNull:false,
  },
  description: {
    type: DataTypes.STRING(256),
    allowNull: false,
  },
  finalPrice: DataTypes.DECIMAL(6, 2),
  newAriivals: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  discount: DataTypes.BOOLEAN,
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  image_name: {
    type: DataTypes.STRING(128),
    allowNull: true,
    defaultValue: null,
  },
  image_secure_url:{
    type: DataTypes.STRING(128),
    allowNull: true,
  },

  // sizes:{
  //     type:DataTypes.JSON,
  //     allowNull:false,
  //     defaultValue:[],
  // },
  // colors:{
  //     type:DataTypes.JSON,
  //     allowNull:false,
  //     defaultValue:[]
  // }
});


CategoriesModel.hasMany(ProductsModel,{foreignKey:"Category__Id", as: "products"});
ProductsModel.belongsTo(CategoriesModel,{foreignKey:"Category__Id", as: "productsCategory"});
ProductsModel.hasMany(ReviewsModel,{foreignKey:"product_id"});
ProductsModel.hasMany(ProductsThumbnailImagesModel,{foreignKey:"product_id"});
ProductsModel.hasMany(ProductsImagesModel,{foreignKey:"product_id"});
ProductsThumbnailImagesModel.belongsTo(ProductsModel,{foreignKey:"product_id"});
ProductsImagesModel.belongsTo(ProductsModel,{foreignKey:"product_id"});
ReviewsModel.belongsTo(ProductsModel,{foreignKey:"product_id"});


// sequelize.sync({alter:true});


