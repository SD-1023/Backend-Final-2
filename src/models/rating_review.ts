import {  DataTypes } from 'sequelize';
import { sequelize } from '../app';


export const Ratings_ReviewsModel = sequelize.define('reviews', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', 
      key: 'id', // The column in the users table that this foreign key references
    }
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id', // The column in the products table that this foreign key references
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1, // Assuming a rating scale of 1 to 5
      max: 5
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true, // Allowing for the possibility of a rating without a comment
  },
  // Any other fields 
}, {
    // Sequelize model options go here

});
