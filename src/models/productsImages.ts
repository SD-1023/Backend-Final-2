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
    thumbnail_url :{
        type:DataTypes.STRING(128),
        allowNull:true,
    },
    alt :{
        type:DataTypes.STRING(56),
        allowNull:true,
    },
    isMain: {
        type:DataTypes.BOOLEAN,
        defaultValue:false,
        allowNull:false
    }
},{
    timestamps:false
})