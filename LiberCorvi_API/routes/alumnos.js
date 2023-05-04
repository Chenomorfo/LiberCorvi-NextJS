import { Router } from "express";
import { Op } from "sequelize";
import DB from "../db.js";

const router = Router();

router.get("/buscar", async (req, res) => {
  const { NC } = req.query;

  const Alumno = await DB.alumnos.findOne({
    where: {
      Numero_Control: NC ?? "",
    },
  });

  res.send(Alumno);
});

router.get("/filtrar", async (req, res) => {
  const { NC } = req.query;

  const Alumnos = await DB.alumnos.findAll({
    where: {
      Numero_Control: {
        [Op.startsWith]: NC ?? "",
      },
    },
    limit: 20,
  });

  res.send(Alumnos);
});

export default router;
