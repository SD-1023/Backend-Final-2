import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";

export const ProductsImagesModel = sequelize.define("productsImages",{
    id:{
        autoIncrement:true,
        type:DataTypes.INTEGER,
        primaryKey:true,
    },
    product_id: {
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    image_url :{
        type:DataTypes.STRING(128),
        allowNull:false,
    },
},{
    timestamps:false
})