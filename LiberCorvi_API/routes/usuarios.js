const { Router } = require("express");
const router = Router();

const pool = require("../dbConn");

router.put("/login", async (req, res) => {
  const { user, pwd } = req.body;

  const query = await pool.query(
    "SELECT * FROM `Usuarios` WHERE UserName = ? AND BINARY Password = ?;",
    [user, pwd]
  );

  res.send(query);
});

router.get("/list", async (req, res) => {
  const query = await pool.query("SELECT * FROM `Usuarios`;");

  res.send(query);
});

router.post("/register", async (req, res) => {
  const { User, Nick, Pwd, Rol } = req.body;

  await pool.query("INSERT INTO Usuarios VALUES (?)", [
    [null, User, Pwd, Nick, Rol],
  ]);

  res.send({ msg: "success" });
});

router.delete("/delete", async (req, res) => {
  const { id } = req.body;

  await pool.query("DELETE FROM Usuarios WHERE Id = ?", [id]);

  res.send({ msg: "success" });
});

module.exports = router;
