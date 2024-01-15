"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersModel = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
exports.OrdersModel = database_1.sequelize.define('orders', {
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
        allowNull: false
    },
    discount: {
        type: sequelize_1.DataTypes.DECIMAL(6, 2),
        allowNull: false,
    },
    deliveryFee: {
        type: sequelize_1.DataTypes.DECIMAL(6, 2),
        allowNull: false,
    },
    subTotal: {
        type: sequelize_1.DataTypes.DECIMAL(6, 2),
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'pending', // Example statuses: 'pending', 'delivered', 'cancelled'
    },
    rating: {
        type: sequelize_1.DataTypes.DECIMAL(6, 2),
        allowNull: false,
    },
    grandTotal: {
        type: sequelize_1.DataTypes.DECIMAL(6, 2),
        allowNull: false,
    } // subTotal - discount - delivery fee
});
