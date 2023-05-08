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
      unique: true,
      validate: {
        len: [4, 100],
      },
    },
    Password: {
      type: DataTypes.STRING().BINARY,
      allowNull: false,
      validate: {
        len: [4, 100],
      },
    },
    Nombre: {
      type: DataTypes.STRING,
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
