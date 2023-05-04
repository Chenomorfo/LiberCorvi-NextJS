import { DataTypes } from "sequelize";
import DB from "../conn.js";

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
      allowNull: false,
    },
    Fecha_Devolucion: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Renovacion: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    Devolucion: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);


export default Registro_Prestamos;
