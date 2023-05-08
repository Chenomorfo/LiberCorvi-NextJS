import { DataTypes } from "sequelize";
import DB from "../conn.js";

const Registro_Visitas = DB.define(
  "Registro_Visitas",
  {
    Fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    Cantidad_Hombres: { type: DataTypes.INTEGER, defaultValue: 0 },
    Cantidad_Mujeres: { type: DataTypes.INTEGER, defaultValue: 0 },
    Turno: {
      type: DataTypes.ENUM(["A", "M", "SM", "SV"]),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);
Registro_Visitas.removeAttribute("id");

export default Registro_Visitas;
