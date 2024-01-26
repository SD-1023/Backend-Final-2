import { DataTypes } from 'sequelize';
import { sequelize } from './../config/database';

export const OrdersModel = sequelize.define("orders",{
    id: {
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
    status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'pending',
    },
})
