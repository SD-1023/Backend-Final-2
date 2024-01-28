import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";

export const CategoriesModel = sequelize.define(
  "categories",
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING(40),
    },
    image_secure_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);
