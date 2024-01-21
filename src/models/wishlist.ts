import { DataTypes } from 'sequelize';
import { sequelize } from './../config/database';

export const WishlistsModel = sequelize.define("wishlists",{
    id: {
        primaryKey:true,
        autoIncrement:true,
        type: DataTypes.INTEGER,
    },
    user_id: {
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull:false,
    }
},{
    timestamps:false,
})