import { DataTypes } from "sequelize";
import DB from "../conn.js";
import Alumnos from "./alumnos.js";

const Registro_Servicios = DB.define(
  "Registro_Servicios",
  {
/*     Id: {
      autoIncrement: true,
      primaryKey: true,
    }, */
    Servicio: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    Fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    Usuario_Registro: DataTypes.ENUM(["A", "M", "SM", "SV"]),
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);
Registro_Servicios.removeAttribute("id");

export default Registro_Servicios;
