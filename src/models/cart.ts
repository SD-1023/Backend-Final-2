import { DataTypes } from 'sequelize';
import { sequelize } from '../app';


export const CartModel = sequelize.define('carts', {
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
      key: 'id', // The column in the users table that this foreign key references
    }
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'active', // Possible values might be 'active', 'completed', 'abandoned'
  },
  //add additional 
}, {
      // Sequelize model options go here

});
