import { Router } from "express";
const router = Router();
import { Op } from "sequelize";

import DB from "../db.js";
import jwt from "jsonwebtoken";
import { SECRET } from "../utils/config.js";
import { verifyToken } from "../utils/controllers/authToken.js";
//In progress

//Completed and tested

router.get("/consultar", async (req, res) => {
  const Usuarios = await DB.usuarios.findAll({
    include: [
      {
        model: DB.roles,
        required: true,
      },
    ],
  });

  res.send(Usuarios);
});

router.get("/consultar/roles", async (req, res) => {
  const Roles = await DB.roles.findAll();

  res.send(Roles);
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
    .then((e) => ({
      Success: "Exito al registrar",
      Msg: "El usuario se ha registrado correctamente",
    }))
    .catch((e) => ({
      Error: "Error al registrar",
      Msg: "El usuario no cumple con los requisitos de registro",
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
    .then((e) => ({
      Success: "Exito al eliminar",
      Msg: "El usuario se elimino correctamente",
    }));

  res.send(Usuario);
});

router.post("/login", async (req, res) => {
  const { user, pwd } = req.body;

  const Usuario = await DB.usuarios
    .findOne({
      where: {
        [Op.and]: [{ Usuario: user }, { Password: pwd }],
      },
    })
    .catch((e) => ({ Warn: "Usuario Inexistente" }));

  if (!Usuario || Usuario?.Warn)
    return res.send({
      Warn: "Usuario Inexistente",
      Msg: "No existe el usuario con el que intento acceder, ¿se olvido de su contraseña?",
    });

  const token = jwt.sign({ Id: Usuario.Id }, SECRET, { expiresIn: 86400 });
  res.send({ Msg: "Inicio de Sesion Correcto", Usuario, token });
});
router.post("/auth", verifyToken, async (req, res) => {
  const Rol = await DB.roles.findOne({
    where: { Id: req.User.Rol },
  });

  if (!Rol)
    return res.send({
      Error: "Missing Rol",
      Msg: "El usuario no cuenta con un rol",
    });

  res.send({ User: req.User, Rol: Rol.dataValues });
});

export default router;
