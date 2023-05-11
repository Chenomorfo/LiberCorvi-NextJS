import { Router } from "express";
import { Op, literal } from "sequelize";
const router = Router();

import DB from "../db.js";

//Completed and tested

router.get("/estadisticas/servicios", async (req, res) => {
  const { fecha, list, turno } = req.query;

  console.log(req.query);
  const Servicios = await DB.registroServicios
    .findAll({
      attributes: [
        "Alumno.Especialidad",
        [literal(`SUM(IF(Alumno.Sexo > 0,1,0))`), "Mujeres"],
        [literal(`SUM(IF(Alumno.Sexo = 0,1,0))`), "Hombres"],
      ],
      include: {
        model: DB.alumnos,
        as: "Alumno",
        required: true,
        attributes: [],
      },
      where: {
        [Op.and]: [
          fecha[1] != "null" ? { Fecha: { [Op.between]: fecha } } : null,
          list
            ? Array.isArray(list)
              ? { Servicio: { [Op.in]: list } }
              : { Servicio: list }
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
  console.log(req.query);
  const Visita = await DB.registroVisitas
    .findAll({
      attributes: [
        [literal("YEAR(Fecha)"), "Year"],
        [literal("MONTH(Fecha)"), "Month"],
        [literal(`SUM(Cantidad_Mujeres)`), "Mujeres"],
        [literal(`SUM(Cantidad_Hombres)`), "Hombres"],
      ],
      where: {
        [Op.and]: [
          Array.isArray(fecha) ? { Fecha: { [Op.between]: fecha } } : null,
          turno != "" ? { Turno: turno } : null,
        ],
      },
      group: ["Year", "Month"],
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
  const { turno } = req.query;

  const Visitas = await DB.registroVisitas.findOne({
    where: {
      [Op.and]: [{ Fecha: new Date() }, turno ? { Turno: turno } : null],
    },
  });

  if (Visitas) res.send(Visitas);
  else
    res.send({
      Error: "Error in finding Date",
      Msg: "The Date setted does not Exists",
    });
});

router.post("/visitas/registrar", async (req, res) => {
  const { turno } = req.body;

  try {
    const Visita = await DB.registroVisitas.create({
      Turno: turno,
    });

    res.send(Visita);
  } catch (error) {
    res.send({ error });
  }
});

router.put("/visitas/actualizar", async (req, res) => {
  const { countM, countH, rol } = req.body;

  const Visita = await DB.registroVisitas.update(
    {
      Cantidad_Hombres: countH,
      Cantidad_Mujeres: countM,
    },
    {
      where: {
        [Op.and]: [{ Fecha: new Date() }, rol ? { Turno: rol } : null],
      },
    }
  );
  res.send(Visita);
});

export default router;
