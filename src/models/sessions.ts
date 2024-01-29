import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";

export const SessionsModel = sequelize.define(
  "sessions",
  {
    sid: { type: DataTypes.STRING(36), primaryKey: true },
  },
  {
    timestamps: true,
  }
);
