import { DataTypes } from "sequelize";
import DB from "../conn.js";

const Ficha_Ejemplares = DB.define(
  "Ficha_Ejemplares",
  {
    Numero_Ficha: {
      type: DataTypes.STRING(50),
    },
    Numero_Adquisicion: DataTypes.INTEGER,

    Numero_Ejemplar: DataTypes.INTEGER(3),

    Fecha_Adquisicion: DataTypes.DATE,

    Fecha_Modificacion: DataTypes.DATE,

    Disponibilidad: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    Usuario_Registro: DataTypes.STRING(50),
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);
Ficha_Ejemplares.removeAttribute("id");

export default Ficha_Ejemplares;
