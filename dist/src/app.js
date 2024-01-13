"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const products_1 = __importDefault(require("./routes/products"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(express_1.default.json());
app.use("/products", products_1.default);
// * Only uncomment this to create a table in your database
// const fillingTables = async ()=>{
//     await ProductsModel.sync({force:true});
//     await fillTables();
// }
// fillingTables()
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running in development mode on PORT : ${PORT}`));
