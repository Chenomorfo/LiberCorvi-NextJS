import { Router } from "express";
import { Op } from "sequelize";
import DB from "../db.js";

const router = Router();

//In progress

//Completed and tested
router.get("/", async (req, res) => {
  const Alumno = await DB.alumnos.findAll();

  res.send(Alumno);
});

router.get("/buscar", async (req, res) => {
  const { nc } = req.query;

  const Alumno = await DB.alumnos.findOne({
    where: {
      Numero_Control: nc ?? "",
    },
  });

  res.send(Alumno);
});

router.get("/consultar", async (req, res) => {
  const { nc } = req.query;

  const Alumnos = await DB.alumnos.findAll({
    where: {
      Numero_Control: {
        [Op.startsWith]: nc ?? "",
      },
    },
    limit: 20,
  });

  res.send(Alumnos);
});

router.get("/agrupar", async (req, res) => {
  const { nc } = req.query;

  const Lista = await DB.alumnos.findAll({
    where: {
      Numero_Control: {
        [Op.in]: [nc],
      },
    },
  });

  res.send(Lista);
});

export default router;
