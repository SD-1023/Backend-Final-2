import { DataTypes } from 'sequelize';
import { sequelize } from "../config/database";


export const CartsModel = sequelize.define('cart', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  product_name: {
    type:DataTypes.STRING(40),
    allowNull:false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity :{
    type:DataTypes.INTEGER,
    allowNull:false
  },
},{
  freezeTableName:true,
});
