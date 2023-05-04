const { Router } = require("express");
const router = Router();

const pool = require("../dbConn");

router.put("/login", async (req, res) => {
  const { user, pwd } = req.body;

  const query = await pool.query(
    `SELECT * FROM usuarios 
        WHERE UserName = ? AND BINARY Password = ?;`,
    [user, pwd]
  );

  res.send(query);
});

router.get("/consultar", async (req, res) => {
  const query = await pool.query("SELECT * FROM usuarios;");

  res.send(query);
});

router.get("/consultar/roles", async (req, res) => {
  const query = await pool
    .query("SELECT Rol as rol FROM usuarios GROUP BY rol;")
    .catch((err) => err);
  res.send(query);
});

router.post("/registrar", async (req, res) => {
  const { User, Nick, Pwd, Rol } = req.body;

  if (!User || !Nick || !Pwd || !Rol) {
    res.send({ msg: "Se requiere llenar todos los campos" });
    return;
  }

  await pool.query("INSERT INTO usuarios VALUES (?)", [
    [null, User, Pwd, Nick, Rol],
  ]);

  res.send({ msg: "Usuario registrado con exito" });
});

router.delete("/eliminar", async (req, res) => {
  const { id } = req.body;

  await pool.query("DELETE FROM usuarios WHERE Id = ?", [id]);

  res.send({ msg: "Usuario eliminado con exito" });
});
module.exports = router;
