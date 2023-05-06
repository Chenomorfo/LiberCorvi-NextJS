import { Router } from "express";
import { Op } from "sequelize";
const router = Router();
import DB from "../db.js";

//In progress

//Completed and Tesed

router.get("/consultar/todos", async (req, res) => {
  const Servicios = await DB.servicios.findAll();
  res.send(Servicios);
});

router.get("/consultar/area", async (req, res) => {
  const { name } = req.query;
  const Servicios = await DB.servicios.findAll({
    where: {
      Nombre: name ?? null,
    },
  });

  res.send(Servicios);
});

router.get("/consultar/servicio", async (req, res) => {
  const { name, num } = req.query;
  const Servicios = await DB.servicios.findOne({
    where: {
      [Op.and]: [{ Nombre: name }, { Numero: num }],
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
      Usuario_Registro: usuario ?? null,
    }))
  );

  res.send(Servicio);
});

router.put("/actualizar", async (req, res) => {
  const { name, num } = req.query;

  const { lista } = req.body;

  const Servicio = await DB.servicios
    .update(
      { Lista: lista.toString() },
      {
        where: {
          [Op.and]: [{ Nombre: name }, { Numero: num }],
        },
      }
    )
    .catch((e) => ({
      Error: "Servicio Inexistente",
      Description:
        "El servicio seleccionado no existe, esta deshabilitado o se encuentra en mantenimieto",
    }));

  res.send(Servicio);
});

export default router;
