import {DataTypes } from 'sequelize';
import { sequelize } from "../config/database";

export const OrdersItemsModel = sequelize.define('ordersItems', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  product_id : {
    type:DataTypes.INTEGER,
    allowNull:false
  },
  order_Id: {
    type: DataTypes.INTEGER,
    allowNull:false,
  },
  discount: { 
    type:DataTypes.DECIMAL(6, 2),
    allowNull:false,
  },
  deliveryFee: { 
    type:DataTypes.DECIMAL(6, 2),
    allowNull:false,
  },
  unit_price:{
    type:DataTypes.DECIMAL(6,2),
    allowNull:false
  },
  unit_quantity:{
      type:DataTypes.INTEGER,
      allowNull:false
  }
},{
  timestamps:false,
});
