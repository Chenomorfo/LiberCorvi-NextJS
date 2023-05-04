import { DataTypes } from "sequelize";
import DB from "../conn.js";

const Alumnos = DB.define(
  "Alumnos",
  {
    Numero_Control: {
      type: DataTypes.STRING(12),
      allowNull: false,
    },
    Nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    Apellido_Paterno: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    Apellido_Materno: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    Sexo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },

    Especialidad: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);
Alumnos.removeAttribute("id");

export default Alumnos;
