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
  product_id:{
    type:DataTypes.INTEGER,
    allowNull:false,
  },
  product_price: {
    type:DataTypes.DECIMAL(10,0),
    allowNull:false
  },
  finalPrice :{
    type:DataTypes.DECIMAL(6,2),
    allowNull:false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity :{
    type:DataTypes.INTEGER,
    allowNull:false
  },
  image_secure_url:{
    type:DataTypes.STRING(256),
    allowNull:false,
  }
},{
  freezeTableName:true,
  timestamps: false,
});
