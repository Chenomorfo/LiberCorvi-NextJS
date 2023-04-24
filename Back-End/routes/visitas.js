const { Router } = require("express");
const router = Router();
const pool = require("../dbConn");

const {
  TotalPoblacionAnual,
  TotalPoblacionPorMes,
  TotalPoblacionPorTrimestre,
  TotalPoblacionPorMesPorAño,
  TotalPoblacionPorTrimestrePorAño,
  TotalPoblacionAnualEspecifica,
  TotalPoblacionAnualRango,
} = require("../Queries/RegistroVisitas");

const { EstadisticasVisitas } = require("../Queries/ConsultaRegistros");


router.get("/", (req, res) => {
  res.send({
    Routes: {
      Query: "/query",
      Estadisticas: "/estadistica",
      AñoMasViejo_Y_AñoMasReciente: "/maxMinDate",
    },
  });
});

router.get("/query", async (req, res) => {
  const query = await pool.query("SELECT * FROM RegistroVisitas");
  res.send(query);
});

router.post("/query", async (req, res) => {
  const { Fecha } = req.body;
  let nuevaFecha = `${new Date(Fecha).getFullYear()}-${
    new Date(Fecha).getMonth() + 1
  }-${new Date(Fecha).getDate()}`;

  await pool.query("INSERT INTO RegistroVisitas (Fecha) VALUES (?)", [
    nuevaFecha,
  ]);

  res.send({ msg: "Fecha registrada" });
});

router.get("/maxMinDate", async (req, res) => {
  const query = await pool.query(
    "SELECT MAX(Fecha) as FechaActual,MIN(Fecha) as FechaAntigua FROM RegistroVisitas"
  );
  res.send(query);
});

router.get("/query/:year", async (req, res) => {
  const { year } = req.params;
  const query = await pool
    .query("SELECT * FROM RegistroVisitas WHERE YEAR(Fecha) = ?", [year])
    .catch((err) => err);
  res.send(query);
});

router.get("/query/:year/:month", async (req, res) => {
  const { year, month } = req.params;

  const query = await pool
    .query(
      "SELECT * FROM RegistroVisitas WHERE YEAR(Fecha) = ? AND MONTH(Fecha) = ?",
      [year, month]
    )
    .catch((err) => err);
  res.send(query);
});

router.get("/query/:year/:month/:day", async (req, res) => {
  const { year, month, day } = req.params;
  const query = await pool
    .query(
      "SELECT * FROM RegistroVisitas WHERE YEAR(Fecha) = ? AND MONTH(Fecha) = ? AND DAY(Fecha) = ?",
      [year, month, day]
    )
    .catch((err) => err);
  res.send(query);
});

router.put("/query/:year/:month/:day", async (req, res) => {
  const { year, month, day } = req.params;
  const { countM, countH } = req.body;

  const query = await pool
    .query(
      "UPDATE RegistroVisitas SET Cant_Hombres = ?, Cant_Mujeres = ? WHERE YEAR(Fecha) = ? AND MONTH(Fecha) = ? AND DAY(Fecha) = ?",
      [countH, countM, year, month, day]
    )
    .catch((err) => err);
  res.send(query);
});

router.get("/estadistica", async (req, res) => {
  res.send({
    Routes: {
      Anual: "/anual",
      Mensual: "/mensual/:year",
      Trimestral: "/trimestral/:year",
    },
  });
});

router.get("/estadistica/anual", async (req, res) => {
  const query = await pool.query(TotalPoblacionAnual());
  res.send(query);
});

router.get("/estadistica/anual/:year", async (req, res) => {
  const { year } = req.params;
  const query = await pool.query(TotalPoblacionAnualEspecifica(year));
  res.send(query);
});

router.get("/estadistica/anual/:yearInit/:yearFinal", async (req, res) => {
  const { yearInit, yearFinal } = req.params;
  const query = await pool.query(TotalPoblacionAnualRango(yearInit, yearFinal));
  res.send(query);
});

router.get("/estadistica/mensual/", async (req, res) => {
  const query = await pool.query(TotalPoblacionPorMes());
  res.send(query);
});

router.get("/estadistica/mensual/:year", async (req, res) => {
  const { year } = req.params;
  const query = await pool.query(TotalPoblacionPorMesPorAño(year));
  res.send(query);
});
router.get("/estadistica/trimestral/", async (req, res) => {
  const query = await pool.query(TotalPoblacionPorTrimestre());
  res.send(query);
});
router.get("/estadistica/trimestral/:year", async (req, res) => {
  const { year } = req.params;
  const query = await pool.query(TotalPoblacionPorTrimestrePorAño(year));
  res.send(query);
});

router.get("/get/estadistica", async (req, res) => {
  const { fecha } = req.query;

  if (!fecha[0] || !fecha[1]) return;

  const query = await pool.query(EstadisticasVisitas(), [
    new Date(fecha[0]),
    new Date(fecha[1]),
  ]);

  res.send(query);
});

module.exports = router;
