"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartsModel = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
exports.CartsModel = database_1.sequelize.define('carts', {
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
            key: 'id', // The column in the users table that this foreign key references
        }
    },
    status: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'active', // Possible values might be 'active', 'completed', 'abandoned'
    },
    //add additional 
}, {
// Sequelize model options go here
});
