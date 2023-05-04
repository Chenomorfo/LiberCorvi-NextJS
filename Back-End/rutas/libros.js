const { Router } = require("express");
const router = Router();
const pool = require("../dbConn");

const {
  ConsultarFicha,
  MostrarPrestamos,
} = require("../Queries/BusquedaLibros");

router.get("/consultar/libro", async (req, res) => {
  const { filtro } = req.query;

  const query = await pool.query(
    `SELECT   fl.Numero_Ficha, 
                fl.Clasificacion,  
                fl.Titulo, 
                fl.Autor 
        FROM fichalibros fl 
        Where  fl.Numero_Ficha LIKE '%${filtro ?? ""}%' 
            OR fl.Titulo       LIKE '%${filtro ?? ""}%' 
            OR fl.Autor        LIKE '%${filtro ?? ""}%' 
        limit 50;`
  );

  res.send(query);
});

router.get("/consultar/ejemplar", async (req, res) => {
  const { ficha } = req.query;

  const query = await pool.query(ConsultarFicha(ficha)).catch((err) => err);
  res.send(query);
});

router.get("/consultar/prestamo", async (req, res) => {
  const query = await pool.query(MostrarPrestamos());

  res.send(query);
});

router.post("/registrar/prestamo", async (req, res) => {
  const {
    Libro,
    Ejemplar,
    Estudiante,
    FechaEntrega,
    FechaDevolucion,
    Tipo,
    Usuario,
  } = req.body;

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

  const registroServicio = [Estudiante, new Date(FechaEntrega), Tipo, Usuario];

  await pool.query("INSERT INTO registroprestamos VALUES (?)", [registroLibro]);

  await pool
    .query("INSERT INTO registroservicios VALUES (?)", [registroServicio])
    .catch((err) => err);

  await pool.query(
    "UPDATE FichaEjemplares fe SET fe.Disponible = 0 WHERE fe.Numero_Adquisicion = ?",
    [Ejemplar]
  );

  res.send({ msg: "Datos insertados" });
});

router.put("/prestamo/renovar/:id", async (req, res) => {
  const { id } = req.params;

  const { FechaDevolucion } = req.body;

  await pool.query(
    "UPDATE registroprestamos SET RenovacionDisponible = 0, FechaDevolucion = ? WHERE Id_Prestamo = ?",
    [new Date(FechaDevolucion), id]
  );

  res.send({ msg: "Dato actualizado" });
});

router.put("/prestamo/devolver/:id", async (req, res) => {
  const { id } = req.params;

  const query = await pool.query(
    `UPDATE registroprestamos SET DevolucionDisponible = 0 WHERE Id_Prestamo = ?;`,
    [id]
  );

  /* await pool.query(
    "UPDATE FichaEjemplares fe SET fe.Disponible = 1 WHERE fe.Numero_Adquisicion = ?",
    [Ejemplar]
  ); */

  res.send({ msg: "Dato actualizado" });
});

module.exports = router;
