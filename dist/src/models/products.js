"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsModel = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.sequelize = new sequelize_1.Sequelize("eCommerceTap", process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOSTNAME,
    dialect: process.env.DB_DIALECT,
    port: Number(process.env.DB_PORT),
});
exports.ProductsModel = exports.sequelize.define("products", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(40),
        allowNull: false,
    },
    price: {
        type: sequelize_1.DataTypes.DECIMAL(6, 2),
        allowNull: false,
    },
    category: {
        type: sequelize_1.DataTypes.STRING(40),
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING(256),
        allowNull: false,
    },
    finalPrice: sequelize_1.DataTypes.DECIMAL(6, 2),
    newAriivals: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    discount: sequelize_1.DataTypes.BOOLEAN,
    quantity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    image_name: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: true,
        defaultValue: null,
    },
    image_secure_url: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: true,
    },
    // sizes:{
    //     type:DataTypes.JSON,
    //     allowNull:false,
    //     defaultValue:[],
    // },
    // colors:{
    //     type:DataTypes.JSON,
    //     allowNull:false,
    //     defaultValue:[]
    // }
});
// ProductsModel.sync({ alter: true }).then((fullfuiiled) => {
//   console.log(fullfuiiled, "fullfilled");
// });
