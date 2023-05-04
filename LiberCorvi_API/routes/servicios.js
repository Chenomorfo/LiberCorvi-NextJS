import { Router } from "express";
import { Op } from "sequelize";
const router = Router();
import DB from "../db.js";

//In progress
router.get("/consultar/todos", async (req, res) => {
  const Servicios = await DB.servicios.findAll();
  res.send(Servicios);
});

router.get("/consultar/area", async (req, res) => {
  const { area } = req.query;
  const Servicios = await DB.servicios.findAll({
    where: {
      Nombre: area,
    },
  });

  res.send(Servicios);
});

router.get("/consultar/servicio", async (req, res) => {
  const { area, numero } = req.query;
  const Servicios = await DB.servicios.findOne({
    where: {
      [Op.and]: [{ Nombre: area }, { Numero: numero }],
    },
  });

  res.send(Servicios);
});

router.get("/consultar/nombres", async (req, res) => {
  const Servicios = await DB.servicios.findAll({
    attributes: ["Nombre"],
    group: "Nombre",
  });
  res.send(Servicios);
});

router.post("/registrar", async (req, res) => {
  const { area } = req.query;
  const { lista, usuario } = req.body;

  const Servicio = await DB.registroServicios.bulkCreate(
    lista.map((item) => ({
      Numero_Control: item,
      Servicio: area,
      Usuario_Registro: usuario,
    }))
  );

  res.send(Servicio);
});
router.put("/actualizar", async (req, res) => {
  const { area, numero } = req.query;

  const { lista } = req.body;

  const Servicio = await DB.servicios
    .findOne({
      where: {
        [Op.and]: [{ Nombre: area }, { Numero: numero }],
      },
    })
    .catch((e) => ({
      Error: "Servicio Inexistente",
      Description:
        "El servicio seleccionado no existe, esta deshabilitado o se encuentra en mantenimieto",
    }));

  if (!Servicio.Error) Servicio.Lista = lista.toString();

  res.send(Servicio);
});

//Completed and Tesed
export default router;
