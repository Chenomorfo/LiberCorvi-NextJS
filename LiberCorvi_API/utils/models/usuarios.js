import { DataTypes } from "sequelize";
import DB from "../conn.js";

const Usuario = DB.define(
  "Usuarios",
  {
    Id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    Usuario: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Password: {
      type: DataTypes.STRING().BINARY,
      allowNull: false,
    },
    Nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Rol: {
      type: DataTypes.ENUM(["A", "M", "SM", "SV"]),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);
Usuario.removeAttribute("id");

export default Usuario;
