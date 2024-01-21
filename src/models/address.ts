import { DataTypes } from 'sequelize';
import { sequelize } from "../config/database";
export const AddressModel = sequelize.define('addresses', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Full__Name:{
      type:DataTypes.STRING(64),
    },
    mobile_number:{
      type:DataTypes.STRING(32),
    },
    country_calling_code:{
      type:DataTypes.STRING(9),
    },
    street: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    postal_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

