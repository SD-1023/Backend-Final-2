import { DataTypes } from "sequelize";
import dotenv from "dotenv";
import { sequelize } from "../config/database";
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
  image_secure_url: {
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
