import { DataTypes } from 'sequelize';
import { sequelize } from './../config/database';
export const SizesModel = sequelize.define("sizes",{
    id:{
        primaryKey:true,
        autoIncrement:true,
        type:DataTypes.INTEGER
    },
    _Size: {
        type:DataTypes.STRING(5),
        allowNull:false,
    },
})