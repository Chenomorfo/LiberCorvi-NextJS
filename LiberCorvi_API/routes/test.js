import { Router } from "express";

const router = Router();

import DB from "../db.js";
import { Op } from "sequelize";

router.post("/rfid", async (req, res) => {
  const { rfid, user } = req.body;

  const alumno = await DB.rfid.findOne({
    attributes: ["UID"],
    where: { UID: rfid },
    include: {
      model: DB.alumnos,
      as: "Alumno",
    },
  });
  res.send(alumno);
});

router.post("/rfid/registros", async (req, res) => {
  const { rfid } = req.body;

  const alumno = await DB.rfid.findOne({
    attributes: ["UID"],
    where: { UID: rfid },
    include: {
      model: DB.alumnos,
      as: "Alumno",
      attributes: [
        "Numero_Control",
        [
          DB.conn.fn(
            "concat",
            DB.conn.col("Nombre"),
            " ",
            DB.conn.col("Apellido_Paterno"),
            " ",
            DB.conn.col("Apellido_Materno")
          ),
          "Nombre",
        ],
        "Especialidad",
      ],
    },
  });

  alumno.Alumno.dataValues.Historial = await DB.registroServicios.findAll({
    where: { Numero_Control: alumno.Alumno.dataValues.Numero_Control },
    include: {
      model: DB.registroPrestamos,
      attributes: [
        "Libro_Numero_Ejemplar",
        "Devolucion",
        "Interno",
        "Fecha_Devolucion",
      ],
    },
    //raw: true,
  });

  res.send(alumno);
});

export default router;
