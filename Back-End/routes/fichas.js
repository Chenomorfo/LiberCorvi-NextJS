const { Router } = require("express");
const router = Router();
const {
  ConsultarLibro,
  MostrarEjemplares,
  MostrarPrestamos,
  ConsultarFicha,
} = require("../Queries/BusquedaLibros");

const pool = require("../dbConn");

router.get("/get/general", async (req, res) => {
  const query = await pool.query(
    "SELECT fl.Numero_Ficha, fl.Clasificacion, fl.Titulo, fl.Autor FROM FichaLibros fl limit 30;"
  );

  res.send(query);
});

router.get("/get/general/:filtro", async (req, res) => {
  const { filtro } = req.params;
  const query = await pool.query(
    `SELECT fl.Numero_Ficha, fl.Clasificacion, fl.Titulo, fl.Autor FROM FichaLibros fl Where fl.Numero_Ficha LIKE '%${filtro}%' OR fl.Titulo LIKE '%${filtro}%' OR fl.Autor LIKE '%${filtro}%' limit 30;`
  );

  res.send(query);
});

router.get("/get/consultarFicha/:ficha", async (req, res) => {
  const { ficha } = req.params;
  const query = await pool
    .query(ConsultarFicha(ficha))
    .catch((err) => err.json());
  res.send(query);
});

router.get("/get/consultarEjemplares/:ficha", async (req, res) => {
  const { ficha } = req.params;
  const query = await pool.query(MostrarEjemplares(ficha));
  res.send(query);
});

router.get("/get/consultarPrestamos", async (req, res) => {
  const query = await pool.query(MostrarPrestamos());

  res.send(query);
});

router.post("/post/registrarPrestamo", async (req, res) => {
  const { Libro, Ejemplar, Estudiante, FechaEntrega, FechaDevolucion } =
    req.body;

  const registroLibro = [
    null,
    Libro,
    Ejemplar,
    Estudiante,
    new Date(FechaEntrega),
    new Date(FechaDevolucion),
    1,
    1,
  ];

  const registroServicio = [Estudiante, new Date(FechaEntrega), "Prestamo"];

  await pool.query("INSERT INTO RegistroPrestamos VALUES (?)", [registroLibro]);

  await pool
    .query("INSERT INTO RegistroServicios VALUES (?)", [registroServicio])
    .catch((err) => err);

  await pool.query(
    "UPDATE FichaEjemplares fe SET fe.Disponible = 0 WHERE fe.Numero_Adquisicion = ?",
    [Ejemplar]
  );

  res.send({ msg: "Datos insertados" });
});

router.put("/put/actualizarPrestamo/renovar/:id", async (req, res) => {
  const { id } = req.params;

  const { FechaDevolucion } = req.body;

  await pool.query(
    "UPDATE RegistroPrestamos SET RenovacionDisponible = 0, FechaDevolucion = ? WHERE Id_Prestamo = ?",
    [new Date(FechaDevolucion), id]
  );

  res.send({ msg: "Dato actualizado" });
});

router.put("/put/actualizarPrestamo/devolver/:id", async (req, res) => {
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
