const { Router } = require("express");
const router = Router();

const pool = require("../dbConn");
const {
  NombreCompleto,
  BuscarAlumno,
  EncontrarAlumno,
} = require("../Queries/Estudiantes");

router.get("/", (req, res) => {
  res.send("Hello");
});

router.get("/estudiantes/all", async (req, res) => {
  const { Ncontrol } = req.query;

  const query = await pool.query(BuscarAlumno(Ncontrol) + " limit 15");

  res.send(query);
});

router.get("/estudiantes/find", async (req, res) => {
  const { Ncontrol } = req.query;

  const query = await pool.query(EncontrarAlumno(Ncontrol));

  res.send(query);
});

router.get("/estudiantes/group", async (req, res) => {
  const { list } = req.query;

  const query = await pool.query(
    `SELECT Numero_Control as code ,${NombreCompleto} as name FROM Alumnos a WHERE Numero_Control IN (?)`,
    [list]
  );

  res.send(query);
});

module.exports = router;
