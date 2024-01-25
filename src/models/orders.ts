import {DataTypes } from 'sequelize';
import { sequelize } from "../config/database";
import { UsersModel } from './users';
import { AddressModel } from './address';
import { OrderProducts } from './orderProducts';

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
  discount: { 
    type:DataTypes.DECIMAL(6, 2),
    allowNull:false,
  },
  deliveryFee: { 
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
    defaultValue: 'pending',
  },
  grandTotal :{
    type:DataTypes.DECIMAL(6, 2),
    allowNull:false,
  },
  street :{
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  city :{
    type: DataTypes.STRING(64),
    allowNull: false,
  },
  mobile_number :{
    type:DataTypes.STRING(32),
  },
  country: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
  unit_price:{
    type:DataTypes.DECIMAL(6,2),
    allowNull:false
  },
  unit_quantity:{
      type:DataTypes.INTEGER,
      allowNull:false
  }
  // subTotal - discount - delivery fee .
});



