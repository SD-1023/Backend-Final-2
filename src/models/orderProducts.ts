import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import { ProductsModel } from "./products";
import { OrdersModel } from "./orders";

export const OrderProducts = sequelize.define('OrderProducts', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
    },
    product_id: {
      type: DataTypes.INTEGER,
    },
  });
  
//   
OrderProducts.belongsTo(ProductsModel, { foreignKey: 'product_id' });
OrderProducts.belongsTo(ProductsModel, { foreignKey: 'product_id' });