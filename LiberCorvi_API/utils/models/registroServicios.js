import { DataTypes } from "sequelize";
import DB from "../conn.js";

const Registro_Servicios = DB.define(
  "Registro_Servicios",
  {
    Numero_Control: {
      type: DataTypes.STRING(12),
      allowNull: false,
    },
    Servicio: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    Fecha: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Usuario_Registro: DataTypes.CHAR(2),
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);
Registro_Servicios.removeAttribute("id");

export default Registro_Servicios;
