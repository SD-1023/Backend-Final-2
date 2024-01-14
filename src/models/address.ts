import { DataTypes } from 'sequelize';
import { sequelize } from "../config/database";
export const AddressModel = sequelize.define('addresses', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
      references: {
        model: 'users', 
        key: 'id', // This is the column name of the referenced model
      }
    },
    // Add any other fields or configurations here
  }, {
    // Sequelize options here
  });
