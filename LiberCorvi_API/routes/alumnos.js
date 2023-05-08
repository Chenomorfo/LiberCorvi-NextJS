import { Router } from "express";
import { Op, literal } from "sequelize";
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
    attributes: [
      "Numero_Control",
      "Especialidad",
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
    ],
    where: {
      Numero_Control: nc ?? "",
    },
  });
  if (Alumno) res.send(Alumno);
  else
    res.send({ Error: "Error de Busqueda", Msg: "No se encontro al alumno" });
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
