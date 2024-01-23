import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";
export const BrandsModel = sequelize.define(
  "brands",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    image_secure_url: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);
