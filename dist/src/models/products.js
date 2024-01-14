"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsModel = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
const fileSystem_1 = require("../config/fileSystem");
const database_1 = require("../config/database");
dotenv_1.default.config();
(0, fileSystem_1.applyFileSysyem)();
// Connects to the fileSystem to enable storing images
exports.ProductsModel = database_1.sequelize.define("products", {
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
