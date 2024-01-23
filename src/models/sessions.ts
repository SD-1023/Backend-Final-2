import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import { UsersModel } from "./users";

export const SessionsModel = sequelize.define(
  "sessions",
  {
    sid: { type: DataTypes.STRING(36), primaryKey: true },
  },
  {
    timestamps: false,
  }
);

SessionsModel.belongsTo(UsersModel, { foreignKey: "userId" });
