const { Router } = require("express");
const router = Router();
import { ConsultarFicha } from "../Queries/BusquedaLibros";
import { EncontrarAlumno } from "../Queries/Estudiantes";
const pool = require("../dbConn");

router.get("/consultar", async (req, res) => {
  const { Ncontrol } = req.query;

  const query = pool.query(EncontrarAlumno(Ncontrol));

  res.send(query);
});

router.get("/filtrar", async (req, res) => {
  const { Ncontrol } = req.query;

  const query = await pool.query(BuscarAlumno(Ncontrol) + " limit 20");

  res.send(query);
});

module.exports = router;
