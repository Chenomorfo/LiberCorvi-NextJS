import { DataTypes } from "sequelize";
import DB from "../conn.js";

const RFID = DB.define(
  "RFID",
  {
    UID: { type: DataTypes.STRING, primaryKey: true },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);
RFID.removeAttribute("id");

export default RFID;
