import { Router } from "express";
import { Op, literal } from "sequelize";
const router = Router();

import DB from "../db.js";

//Completed and tested

router.get("/estadisticas/servicios", async (req, res) => {
  const { fecha, service, turno } = req.query;

  const Servicios = await DB.registroServicios
    .findAll({
      attributes: [],
      include: {
        model: DB.alumnos,
        as: "Alumno",
        required: true,
        attributes: [
          "Especialidad",
          [literal(`SUM(IF(Sexo > 0,1,0))`), "Mujeres"],
          [literal(`SUM(IF(Sexo = 0,1,0))`), "Hombres"],
        ],
      },
      where: {
        [Op.and]: [
          Array.isArray(service) ? { Fecha: { [Op.between]: fecha } } : null,
          service
            ? Array.isArray(service)
              ? { Servicio: { [Op.in]: service } }
              : { Servicio: service }
            : null,
          turno ? { Usuario_Registro: turno } : null,
        ],
      },
      group: "Especialidad",
      raw: true,
    })
    .catch((e) => ({
      Error: "Failed to Select List",
      Msg: "Check the syntax",
    }));

  res.send(Servicios);
});

router.get("/estadisticas/visitas", async (req, res) => {
  const { fecha, turno } = req.query;

  const Visita = await DB.registroVisitas
    .findAll({
      where: {
        [Op.and]: [
          Array.isArray(fecha) ? { Fecha: { [Op.between]: fecha } } : null,
          turno ? { Turno: turno } : null,
        ],
      },
    })
    .catch((e) => ({
      Error: "Error in Dates range",
      Msg: "The Dates setted are invalid",
    }));

  res.send(Visita);
});

router.get("/visitas", async (req, res) => {
  const Visitas = await DB.registroVisitas.findAll();

  res.send(Visitas);
});

router.get("/visitas/consultar", async (req, res) => {
  const { year, month, day, turno } = req.query;

  const Visitas = await DB.registroVisitas.findAll({
    where: {
      [Op.and]: [
        { Fecha: new Date(year, month, day) },
        turno ? { Turno: turno } : null,
      ],
    },
  });

  res.send(Visitas);
});

router.post("/visitas/registrar", async (req, res) => {
  const { Fecha, rol } = req.body;

  const Visita = await DB.registroVisitas
    .create({
      Fecha: new Date(Fecha),
      Turno: rol ?? null,
    })
    .catch((e) => ({
      Error: "Error in Date register",
      Msg: "The Date setted is Invalid or the Rol is not exists",
    }));

  res.send(Visita);
});

router.put("/visitas/actualizar", async (req, res) => {
  const { year, month, day } = req.query;
  const { countM, countH, rol } = req.body;

  const Visita = await DB.registroVisitas.update(
    {
      Cantidad_Hombres: countH,
      Cantidad_Mujeres: countM,
    },
    {
      where: {
        [Op.and]: [{ Fecha: new Date(year, month, day) }, { Turno: rol ?? "" }],
      },
    }
  );

  res.send(Visita);
});

export default router;
