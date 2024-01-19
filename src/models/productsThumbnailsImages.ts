import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";

export const ProductsThumbnailImagesModel = sequelize.define("productsThumbnails",{
    id:{
        autoIncrement:true,
        type:DataTypes.INTEGER,
        primaryKey:true,
    },
    product_id: {
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    image_thumbnail_url :{
        type:DataTypes.STRING(128),
        allowNull:false,
    },
},{
    timestamps:false
})