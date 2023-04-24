const { Router } = require("express");
const router = Router();

const pool = require("../dbConn");

const {
  RegistroServicioCarreraPorAño,
} = require("../Queries/RegistroServicios");

router.get("/", (req, res) => {
  res.send({ msg: "Pagina inicial Servicios" });
});

router.get("/nombres", async (req, res) => {
  const query = await pool.query(
    "SELECT rs.Servicio FROM RegistroServicios rs GROUP by rs.Servicio;"
  );
  res.send(query);
});

router.get("/query", async (req, res) => {
  const query = await pool.query("SELECT * FROM Servicio");

  res.send(query);
});

router.get("/query/:area", async (req, res) => {
  const { area } = req.params;
  const query = await pool
    .query("SELECT * FROM Servicio WHERE Area = ?", [area])
    .catch((err) => err);

  res.send(query);
});

router.get("/query/:area/:numero", async (req, res) => {
  const { area, numero } = req.params;
  const query = await pool
    .query("SELECT * FROM Servicio WHERE Area = ? AND Numero = ?", [
      area,
      numero,
    ])
    .catch((err) => err);

  res.send(query);
});

router.put("/query/:area/:numero", async (req, res) => {
  const { lista } = req.body;
  try {
    var newLista = lista.toString();
  } catch (error) {
    var newLista = null;
  }

  const { area, numero } = req.params;
  await pool
    .query("UPDATE Servicio SET Lista = ? WHERE Area = ? AND Numero = ?", [
      newLista,
      area,
      numero,
    ])
    .catch((err) => err);
  res.send("Datos actualizados");
});

router.post("/insert/:area", async (req, res) => {
  const { area } = req.params;
  const { lista } = req.body;
  let newLista = lista.map((item) => {
    return [item, new Date(), area];
  });

  await pool
    .query("INSERT INTO RegistroServicios VALUES ?", [newLista])
    .catch((err) => console.log(err));

  res.send("Datos actualizados");
});

router.get("/registros", async (req, res) => {
  const query = await pool.query("SELECT * FROM RegistroServicios");

  res.send(query);
});

router.get("/registros/:Fecha", async (req, res) => {
  const { Fecha } = req.params;
  const query = await pool.query(
    "SELECT * FROM RegistroServicios WHERE Fecha = ?",
    [Fecha]
  );

  res.send(query);
});

router.get("/estadisticas/:Fecha", async (req, res) => {
  const { Fecha } = req.params;
  const query = await pool.query(RegistroServicioCarreraPorAño(Fecha));

  res.send(query);
});

router.get("/get/stats", async (req, res) => {
  const { date, list } = req.query;

  if (!date && !list) {
    res.send({ error: "No data" });
    return;
  }

  if (list) {
    const query = await pool.query(
      `SELECT 
        a.Especialidad as Especialidad ,
        SUM(IF(a.Sexo > 0, 1,0)) as Mujeres, 
        SUM(IF(a.Sexo = 0, 1,0)) as Hombres 
      FROM RegistroServicios rs JOIN Alumnos a ON a.Numero_Control = rs.NumControl
      WHERE  Fecha BETWEEN (?) AND (?) AND Servicio IN (?)
      GROUP BY a.Especialidad;`,
      [new Date(date[0]), new Date(date[1]), list]
    );
    res.send(query);
    return;
  }
  const query = await pool.query(
    `SELECT 
      a.Especialidad as Especialidad ,
      SUM(IF(a.Sexo > 0, 1,0)) as Mujeres, 
      SUM(IF(a.Sexo = 0, 1,0)) as Hombres 
      FROM RegistroServicios rs JOIN Alumnos a ON a.Numero_Control = rs.NumControl
      WHERE Fecha BETWEEN (?) AND (?)
      GROUP BY a.Especialidad;`,
    [new Date(date[0]), new Date(date[1])]
  );

  res.send(query);
});

module.exports = router;
