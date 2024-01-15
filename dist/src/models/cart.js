"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartsModel = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
exports.CartsModel = database_1.sequelize.define('cart', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    product_name: {
        type: sequelize_1.DataTypes.STRING(40),
        allowNull: false,
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    quantity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
}, {
    freezeTableName: true,
});
