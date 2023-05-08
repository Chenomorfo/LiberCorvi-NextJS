import { DataTypes } from "sequelize";
import DB from "../conn.js";

const Roles = DB.define(
  "Roles",
  {
    Id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    Nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Code: {
      type: DataTypes.ENUM(["A", "M", "SM", "SV"]),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

Roles.removeAttribute("id");

export default Roles;
