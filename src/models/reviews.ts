import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";
<<<<<<< HEAD
import { ProductsModel } from "./products";
=======
>>>>>>> 9604d9121b9c910101fbf92cb54cbb0c26140a5d

export const ReviewsModel = sequelize.define("reviews", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  comment: {
    type: DataTypes.STRING(126),
    allowNull: true,
  },
<<<<<<< HEAD
});
=======
});
>>>>>>> 9604d9121b9c910101fbf92cb54cbb0c26140a5d
