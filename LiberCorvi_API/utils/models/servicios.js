import { DataTypes } from "sequelize";
import DB from "../conn.js";

const Servicio = DB.define(
  "Servicios",
  {
    Nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Numero: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Lista: DataTypes.STRING(),
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);
Servicio.removeAttribute("id");
export default Servicio;
