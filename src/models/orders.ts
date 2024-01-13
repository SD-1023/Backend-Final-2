import {DataTypes } from 'sequelize';
import { sequelize } from '../app';


export const OrdersModel = sequelize.define('orders', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // This should match the table name for users
      key: 'id', // This is the column name of the referenced model
    }
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'pending', // Example statuses: 'pending', 'completed', 'cancelled'
  },
  // Additional fields 
}, {
  // Sequelize model options go here
  
});

