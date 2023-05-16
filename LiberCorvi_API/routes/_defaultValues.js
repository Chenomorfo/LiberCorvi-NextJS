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
  let servicios = []
  for (let i = 0; i < 6; i++) { servicios.push({ Nombre: 'Mesa', Numero: i++ }) }
  for (let i = 0; i < 2; i++) { servicios.push({ Nombre: 'Restirador', Numero: i++ }) }
  for (let i = 0; i < 3; i++) { servicios.push({ Nombre: 'Cubiculo', Numero: i++ }) }
  for (let i = 0; i < 13; i++) { servicios.push({ Nombre: 'Laptop', Numero: i++ }) }
  for (let i = 0; i < 22; i++) { servicios.push({ Nombre: 'Computadora', Numero: i++ }) }

  await DB.servicios.bulkCreate(servicios);

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
  try {
    //await DB.fichaLibros.destroy({ truncate: true });
    const divider = Math.ceil(FichaLibros.length / 15);

    for (let i = 0; i < divider; i++) {
      if (i == divider - 1) await DB.fichaLibros.bulkCreate(FichaLibros);
      else await DB.fichaLibros.bulkCreate(FichaLibros.splice(-divider));
    }

    //res.send({ msg: "Carga Finalizada" });
    res.redirect('fichaEjemplares') 
  } catch (error) {
    res.send({error})
  }
});

router.get("/fichaEjemplares", async (req, res) => {
  //await DB.fichaEjemplares.destroy({ truncate: true });
  const divider = Math.ceil(FichaEjemplares.length / 20);

  try {
    for (let i = 0; i < 20; i++) {
      if (i == divider - 1)
        await DB.fichaEjemplares.bulkCreate(FichaEjemplares);
      else
        await DB.fichaEjemplares.bulkCreate(FichaEjemplares.splice(-divider));
    }

    res.send({ msg: "Carga Finalizada" }); 

  } catch (error) {
    res.send({ msg: "Error al cargar", error });
  }
});

export default router;
