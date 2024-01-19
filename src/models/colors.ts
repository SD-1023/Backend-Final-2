import { DataTypes } from 'sequelize';
import { sequelize } from './../config/database';
export const ColorsModel = sequelize.define("colors",{
    id:{
        primaryKey:true,
        autoIncrement:true,
        type:DataTypes.INTEGER
    },
    _Color: {
        type:DataTypes.STRING(5),
        allowNull:false,
    },
})