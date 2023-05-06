import { DataTypes } from "sequelize";
import DB from "../conn.js";

const Registro_Visitas = DB.define(
  "Registro_Visitas",
  {
    Fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    Cantidad_Hombres: DataTypes.INTEGER,
    Cantidad_Mujeres: DataTypes.INTEGER,
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