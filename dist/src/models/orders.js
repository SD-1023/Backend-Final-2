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
        references: {
            model: 'users', // This should match the table name for users
            key: 'id', // This is the column name of the referenced model
        }
    },
    total: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'pending', // Example statuses: 'pending', 'completed', 'cancelled'
    },
    // Additional fields 
}, {
// Sequelize model options go here
});
