import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import { ProductsModel } from "./products";

export const ReviewsModel = sequelize.define("reviews", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  comment: {
    type: DataTypes.STRING(126),
    allowNull: true,
  },
});
