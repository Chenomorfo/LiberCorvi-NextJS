const { Router } = require("express");
const router = Router();

const pool = require("../dbConn");

router.get("/consultar/todos", async (req, res) => {
  const query = await pool
    .query("SELECT * FROM Servicio")
    .catch((err) => err);

  res.send(query);
});

router.get("/consultar/areas", async (req, res) => {
  const { area } = req.query;
  if (!area) {
    res.send({ msg: "Se requiere especificar el area" });
    return;
  }
  const query = await pool
    .query("SELECT * FROM Servicio WHERE Area = ?", [area])
    .catch((err) => err);

  res.send(query);
});

router.get("/consultar/servicios", async (req, res) => {
  const { area, numero } = req.query;
  if (!area || !numero) {
    res.send({ msg: "Se requieren ambos campos" });
    return;
  }

  const query = await pool
    .query(
      `SELECT * FROM 
                Servicio 
        WHERE   Area = ? AND Numero = ?`,
      [area, numero]
    )
    .catch((err) => err);

  res.send(query);
});

router.get("/consultar/nombres", async (req, res) => {
  const query = await pool.query(
    "SELECT rs.Servicio FROM RegistroServicios rs GROUP by rs.Servicio;"
  );
  res.send(query);
});

router.post("/registrar", async (req, res) => {
  const { area } = req.query;
  const { lista, usuario } = req.body;

  let newLista = lista.map((item) => {
    return [item, new Date(), area, usuario];
  });

  await pool
    .query("INSERT INTO RegistroServicios VALUES ?", [newLista])
    .catch((err) => console.log(err));

  res.send("Datos actualizados");
});

router.put("/actualizar", async (req, res) => {
  const { area, numero } = req.query;

  if (!area || !numero) {
    res.send({ msg: "Se requieren ambos campos" });
    return;
  }
  const { lista } = req.body;

  await pool
    .query("UPDATE Servicio SET Lista = ? WHERE Area = ? AND Numero = ?", [
      lista ? lista.toString() : null,
      area,
      numero,
    ])
    .catch((err) => err);

  res.send("Datos actualizados");
});

module.exports = router;
