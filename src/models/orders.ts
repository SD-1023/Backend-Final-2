import {DataTypes } from 'sequelize';
import { sequelize } from "../config/database";


export const OrdersModel = sequelize.define('orders', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product_id : {
    type:DataTypes.INTEGER,
    allowNull:false
  },
  discount: { // no need 
    type:DataTypes.DECIMAL(6, 2),
    allowNull:false,
  },
  deliveryFree: { // corrected the name
    type:DataTypes.DECIMAL(6, 2),
    allowNull:false,
  },
  subTotal: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'pending', // Example statuses: 'pending', 'delivered', 'cancelled'
  },
  rating: {
    type:DataTypes.DECIMAL(6,2),
    allowNull:false,
  },
  grandTotal :{
    type:DataTypes.DECIMAL(6, 2),
    allowNull:false,
  }, // subTotal - discount - delivery fee .

  address :{ // add it insted of the table I removed 
    type:DataTypes.JSON,
    allowNull:false,
  }
  

});

