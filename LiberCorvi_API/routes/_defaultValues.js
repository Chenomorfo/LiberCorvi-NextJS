import { Router } from "express";
const router = Router();

import AlumnosJSON from "../localDB/alumnos.json" assert { type: "json" };
import FichaLibros from "../localDB/fichalibros.json" assert { type: "json" };
import FichaEjemplares from "../localDB/fichaejemplares.json" assert { type: "json" };

import DB from "../db.js";
import { verifyToken } from "../utils/controllers/authToken.js";

router.get("/ping", verifyToken, async (req, res) => {
  res.send({ msg: "Pong" });
});

router.get("/users", async (req, res) => {
  await DB.usuarios.destroy({ truncate: true });

  await DB.usuarios.create({
    Usuario: "admin",
    Password: "admin",
    Nombre: "Cheno",
    Rol: 1,
  });

  res.send({ msg: "Usuarios creados" });
});

router.get("/servicios", async (req, res) => {
  await DB.servicios.destroy({ truncate: true });

  await DB.servicios.bulkCreate([
    { Nombre: "Cubiculo", Numero: 1 },
    { Nombre: "Cubiculo", Numero: 2 },
    { Nombre: "Cubiculo", Numero: 3 },
    { Nombre: "Cubiculo", Numero: 4 },
    { Nombre: "Cubiculo", Numero: 5 },
    { Nombre: "Restirador", Numero: 1 },
    { Nombre: "Restirador", Numero: 2 },
    { Nombre: "Mesa", Numero: 1 },
    { Nombre: "Mesa", Numero: 2 },
    { Nombre: "Mesa", Numero: 3 },
    { Nombre: "Laptop", Numero: 1 },
    { Nombre: "Laptop", Numero: 2 },
    { Nombre: "Laptop", Numero: 3 },
    { Nombre: "Laptop", Numero: 4 },
    { Nombre: "Laptop", Numero: 5 },
    { Nombre: "Laptop", Numero: 6 },
    { Nombre: "Laptop", Numero: 7 },
    { Nombre: "Laptop", Numero: 8 },
    { Nombre: "Laptop", Numero: 9 },
    { Nombre: "Laptop", Numero: 10 },
    { Nombre: "Laptop", Numero: 11 },
    { Nombre: "Laptop", Numero: 12 },
    { Nombre: "Laptop", Numero: 13 },
    { Nombre: "Computadora", Numero: 1 },
    { Nombre: "Computadora", Numero: 2 },
    { Nombre: "Computadora", Numero: 3 },
    { Nombre: "Computadora", Numero: 4 },
    { Nombre: "Computadora", Numero: 5 },
    { Nombre: "Computadora", Numero: 6 },
    { Nombre: "Computadora", Numero: 7 },
    { Nombre: "Computadora", Numero: 8 },
    { Nombre: "Computadora", Numero: 9 },
    { Nombre: "Computadora", Numero: 10 },
    { Nombre: "Computadora", Numero: 11 },
    { Nombre: "Computadora", Numero: 12 },
  ]);

  res.send({ msg: "Servicios creados" });
});

router.get("/roles", async (req, res) => {
  //await DB.alumnos.destroy({ truncate: true });

  await DB.roles.bulkCreate([
    { Nombre: "Administrador", Code: "A" },
    { Nombre: "Moderador", Code: "M" },
    { Nombre: "Servicio Matutino", Code: "SM" },
    { Nombre: "Servicio Vespertino", Code: "SV" },
  ]);

  res.send({ msg: "Roles creados" });
});

//Completed and Tested

router.get("/alumnos", async (req, res) => {
  //await DB.alumnos.destroy({ truncate: true });

  await DB.alumnos.bulkCreate(AlumnosJSON);

  res.send({ msg: "Alumnos ingresados" });
});
router.get("/fichaLibros", async (req, res) => {
  await DB.fichaLibros.destroy({ truncate: true });
  const divider = Math.ceil(FichaLibros.length / 15);

  for (let i = 0; i < divider; i++) {
    if (i == divider - 1) await DB.fichaLibros.bulkCreate(FichaLibros);
    else await DB.fichaLibros.bulkCreate(FichaLibros.splice(-divider));
  }

  res.send({ msg: "Carga Finalizada" });
});

router.get("/fichaEjemplares", async (req, res) => {
  //await DB.fichaEjemplares.destroy({ truncate: true });
  const divider = Math.ceil(FichaEjemplares.length / 10);

  for (let i = 0; i < 10; i++) {
    if (i == divider - 1) await DB.fichaEjemplares.bulkCreate(FichaEjemplares);
    else await DB.fichaEjemplares.bulkCreate(FichaEjemplares.splice(-divider));
  }

  res.send({ msg: "Carga Finalizada" });
});

export default router;
