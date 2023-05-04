const { Router } = require("express");
const router = Router();
const pool = require("../dbConn");

const {
  NombreCompleto,
  BuscarAlumno,
  EncontrarAlumno,
} = require("../Queries/Estudiantes");

router.get("/consultar", async (req, res) => {
  const { Ncontrol } = req.query;

  const query = await pool
    .query(BuscarAlumno(Ncontrol) + " limit 25")
    .catch((err) => err);

  res.send(query);
});

router.get("/buscar", async (req, res) => {
  const { Ncontrol } = req.query;

  const query = await pool.query(EncontrarAlumno(Ncontrol)).catch((err) => err);

  res.send(query);
});

router.get("/agrupar", async (req, res) => {
  const { list } = req.query;

  const query = await pool.query(
    `SELECT Numero_Control      as code ,
            ${NombreCompleto}   as name 
    FROM alumnos a WHERE Numero_Control IN (?)`,
    [list]
  );

  res.send(query);
});

module.exports = router;
