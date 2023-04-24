const { Router } = require("express");
const router = Router();
const pool = require("../dbConn");
const {
  EstadisticasVisitas,
  EstadisticasVisitasTurno,
  EstadisticasServiciosLista,
  EstadisticasServicios,
  EstadisticasServiciosListaTurno,
  EstadisticasServiciosTurno,
} = require("../Queries/ConsultaRegistros");

router.get("/visitas", async (req, res) => {
  const query = await pool.query("SELECT * FROM RegistroVisitas");
  res.send(query);
});

router.get("/visitas/consultar", async (req, res) => {
  const { year, month, day, turno } = req.query;
  const query = await pool
    .query(
      "SELECT * FROM RegistroVisitas WHERE YEAR(Fecha) = ? AND MONTH(Fecha) = ? AND DAY(Fecha) = ? AND Turno = ?",
      [year, month, day, turno]
    )
    .catch((err) => err);
  res.send(query);
});

router.post("/visitas/", async (req, res) => {
  const { Fecha, rol } = req.body;

  let nuevaFecha = new Date(Fecha);
  nuevaFecha = `${nuevaFecha.getFullYear()}-${
    nuevaFecha.getMonth() + 1
  }-${nuevaFecha.getDate()}`;

  await pool.query(
    "INSERT INTO RegistroVisitas (Fecha, Cant_Hombres, Cant_Mujeres,Turno) VALUES (?)",
    [[nuevaFecha, 0, 0, rol]]
  );

  res.send({ msg: "Fecha registrada" });
});

router.put("/visitas/actualizar", async (req, res) => {
  const { year, month, day } = req.query;
  const { countM, countH, rol } = req.body;

  const query = await pool
    .query(
      `UPDATE RegistroVisitas SET Cant_Hombres = ?, Cant_Mujeres = ? 
        WHERE YEAR(Fecha) = ? AND MONTH(Fecha) = ? AND DAY(Fecha) = ? AND Turno = ?`,
      [countH, countM, year, month, day, rol]
    )
    .catch((err) => err);
  res.send(query);
});

router.get("/estadisticas/servicios", async (req, res) => {
  const { date, list, turno } = req.query;

  if (!date && !list) {
    res.send({ error: "No data" });
    return;
  }

  if (list) {
    if (turno != "undefined" && turno != "null") {
      const query = await pool.query(EstadisticasServiciosListaTurno(), [
        new Date(date[0]),
        new Date(date[1]),
        list,
        turno,
      ]);
      res.send(query);
      return;
    }
    const query = await pool.query(EstadisticasServiciosLista(), [
      new Date(date[0]),
      new Date(date[1]),
      list,
    ]);
    res.send(query);
    return;
  }

  if (turno != "undefined" && turno != "null") {
    const query = await pool.query(EstadisticasServiciosTurno(), [
      new Date(date[0]),
      new Date(date[1]),
      turno,
    ]);
    res.send(query);
    return;
  }
  const query = await pool.query(EstadisticasServicios(), [
    new Date(date[0]),
    new Date(date[1]),
  ]);

  res.send(query);
});

router.get("/estadisticas/visitas", async (req, res) => {
  const { fecha, turno } = req.query;

  let query;
  if (!fecha[0] || !fecha[1]) return;

  if (turno != "undefined" && turno != "null") {
    query = await pool.query(EstadisticasVisitasTurno(), [
      new Date(fecha[0]),
      new Date(fecha[1]),
      turno,
    ]);
  } else {
    query = await pool.query(EstadisticasVisitas(), [
      new Date(fecha[0]),
      new Date(fecha[1]),
    ]);
  }

  res.send(query);
});

module.exports = router;
