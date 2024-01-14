"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsModel = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
exports.ReviewsModel = database_1.sequelize.define('reviews', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id', // The column in the users table that this foreign key references
        }
    },
    product_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'products',
            key: 'id', // The column in the products table that this foreign key references
        }
    },
    rating: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1, // Assuming a rating scale of 1 to 5
            max: 5
        }
    },
    comment: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true, // Allowing for the possibility of a rating without a comment
    },
    // Any other fields 
}, {
// Sequelize model options go here
});
