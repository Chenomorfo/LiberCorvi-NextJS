import { DataTypes } from "sequelize";
import DB from "../conn.js";
import { addDays } from "../functions.js";
const Registro_Prestamos = DB.define(
  "Registro_Prestamos",
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Libro_Numero_Ficha: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    Libro_Numero_Ejemplar: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Estudiante_Numero_Control: {
      type: DataTypes.STRING(12),
      allowNull: false,
    },
    Fecha_Adquisicion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    Fecha_Devolucion: {
      type: DataTypes.DATE,
      defaultValue: addDays(new Date(), 2),
    },
    Renovacion: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    Devolucion: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: false,
  }
);

export default Registro_Prestamos;
