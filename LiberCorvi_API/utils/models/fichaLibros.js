import { DataTypes } from "sequelize";
import DB from "../conn.js";

const Ficha_Libros = DB.define(
  "Ficha_Libros",
  {
    Numero_Ficha: {
      type: DataTypes.STRING(50),
      primaryKey: true,
    },
    Fecha_Registro: DataTypes.DATE,

    Fecha_Modificacion: DataTypes.DATE,

    Editorial: DataTypes.STRING,

    Edicion: DataTypes.INTEGER(2),

    ISBN: DataTypes.STRING(50),

    Clasificacion: DataTypes.STRING(50),

    Titulo: DataTypes.STRING,

    Autor: DataTypes.STRING,

    Contenido: DataTypes.TEXT,
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);
Ficha_Libros.removeAttribute("id");

export default Ficha_Libros;
