"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressModel = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
exports.AddressModel = database_1.sequelize.define('addresses', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    street: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    city: {
        type: sequelize_1.DataTypes.STRING(64),
        allowNull: false,
    },
    state: {
        type: sequelize_1.DataTypes.STRING(64),
        allowNull: false,
    },
    postal_code: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    country: {
        type: sequelize_1.DataTypes.STRING(64),
        allowNull: false,
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
});
