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
  rating: {
    type:DataTypes.DECIMAL(6,2),
    allowNull:false,
  },
  grandTotal :{
    type:DataTypes.DECIMAL(6, 2),
    allowNull:false,
  }, // subTotal - discount - delivery fee .
  address_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },


});
UsersModel.hasOne(OrdersModel, { foreignKey: 'user_id', as: 'order' });
OrdersModel.belongsTo(UsersModel, { foreignKey: 'user_id', as: 'user' });
OrdersModel.belongsTo(AddressModel, { foreignKey: 'address_id', as: 'address' });
OrdersModel.hasMany(OrderProducts, { foreignKey: 'order_id' });



