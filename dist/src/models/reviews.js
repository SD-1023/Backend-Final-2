"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsModel = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const products_1 = require("./products");
exports.ReviewsModel = database_1.sequelize.define('reviews', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    product_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    rating: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    comment: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
});
exports.ReviewsModel.hasOne(products_1.ProductsModel, { foreignKey: "id" });
products_1.ProductsModel.hasMany(exports.ReviewsModel, { foreignKey: "product_id" });
