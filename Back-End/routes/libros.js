const { Router } = require("express");
const router = Router();
import { ConsultarFicha } from "../Queries/BusquedaLibros";
const pool = require("../dbConn");

router.get("/consultar", async (req, res) => {
  const { ficha } = req.query;
  const query = await pool
    .query(ConsultarFicha(ficha))
    .catch((err) => err.json());

  res.send(query);
});

router.get("/general", async (req, res) => {
  const { filtro } = req.query;
  const query = await pool.query(
    `SELECT fl.Numero_Ficha, fl.Clasificacion, fl.Titulo, fl.Autor FROM FichaLibros fl Where fl.Numero_Ficha LIKE '%${filtro}%' OR fl.Titulo LIKE '%${filtro}%' OR fl.Autor LIKE '%${filtro}%' limit 30;`
  );

  res.send(query);
});

router.put("/prestamo/renovar/:id", async (req, res) => {
  const { id } = req.params;

  const { FechaDevolucion } = req.body;

  await pool.query(
    "UPDATE RegistroPrestamos SET RenovacionDisponible = 0, FechaDevolucion = ? WHERE Id_Prestamo = ?",
    [new Date(FechaDevolucion), id]
  );

  res.send({ msg: "Dato actualizado" });
});

router.put("/prestamo/devolver/:id", async (req, res) => {
  const { id } = req.params;

  const query = await pool.query(
    `UPDATE RegistroPrestamos SET DevolucionDisponible = 0 WHERE Id_Prestamo = ?;`,
    [id]
  );

  /* await pool.query(
      "UPDATE FichaEjemplares fe SET fe.Disponible = 1 WHERE fe.Numero_Adquisicion = ?",
      [Ejemplar]
    ); */

  res.send({ msg: "Dato actualizado" });
});

module.exports = router;
