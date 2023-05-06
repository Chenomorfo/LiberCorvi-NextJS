import { Router } from "express";
const router = Router();
import { Op } from "sequelize";

import DB from "../db.js";

//In progress

//Completed and tested

router.get("/consultar", async (req, res) => {
  const Usuarios = await DB.usuarios.findAll();

  res.send(Usuarios);
});

router.get("/consultar/roles", async (req, res) => {
  const Usuarios = await DB.usuarios.findAll({
    attributes: ["Rol"],
  });

  res.send(Usuarios);
});

router.post("/registrar", async (req, res) => {
  const { User, Nick, Pwd, Rol } = req.body;

  const Usuario = await DB.usuarios
    .create({
      Usuario: User,
      Password: Pwd,
      Nombre: Nick,
      Rol: Rol,
    })
    .catch((e) => ({
      Error: "Error in register",
      Message:
        "The user you try to register is wrong, check if you miss any field",
    }));

  res.send(Usuario);
});

router.delete("/eliminar/:id", async (req, res) => {
  const { id } = req.params;

  const Usuario = await DB.usuarios
    .destroy({
      where: {
        Id: id,
      },
    })
    .then((e) => ({ Msg: "User Eliminated" }));

  res.send(Usuario);
});

router.put("/login", async (req, res) => {
  const { user, pwd } = req.body;

  const Usuario = await DB.usuarios.findOne({
    where: {
      [Op.and]: [{ Usuario: user }, { Password: pwd }],
    },
  });

  res.send(Usuario);
});

export default router;
