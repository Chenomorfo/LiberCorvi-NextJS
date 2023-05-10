import { Router } from "express";
const router = Router();

import { DataTypes, Op, QueryTypes, Sequelize } from "sequelize";
import DB from "../db.js";

import { addDays } from "../utils/functions.js";

//Not yer
router.get("/buscar/ficha", async (req, res) => {
  const { ficha } = req.query;
  try {
    const Lista = await DB.conn.query(
      `
      SELECT 	fl.Numero_Ficha,
		          fl.Titulo,
              fl.Autor,
              fe.Numero_Adquisicion
	    FROM ${DB.fichaLibros.tableName} fl JOIN ${DB.fichaEjemplares.tableName} fe ON fl.Numero_Ficha = fe.Numero_Ficha
      WHERE fl.Numero_Ficha = :buscar_ficha;`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          buscar_ficha: ficha,
        },
      }
    );

    res.send({ Success:"Libro valido",Msg: "Desplegando lista de libros", Lista });
  } catch (error) {
    res.send({ Msg: "Libro sin ejemplares", error });
  }
});

//Can do better
router.get("/consultar/ejemplar", async (req, res) => {
  const { libro } = req.query;
  const Ejemplar = await DB.conn.query(
    `SELECT * FROM ${DB.fichaEjemplares.tableName} ta JOIN ${DB.fichaLibros.tableName} tb 
    ON ta.Numero_Ficha = tb.Numero_Ficha
    WHERE ta.Numero_Adquisicion = :buscar_libro`,
    {
      type: QueryTypes.SELECT,
      replacements: {
        buscar_libro: libro,
      },
    }
  );

  res.send(Ejemplar);
});

//Completed and Tested
router.get("/consultar/libro", async (req, res) => {
  const { filter } = req.query;
  const Fichas = await DB.fichaLibros.findAll(
    filter != ""
      ? {
          limit: 50,
          where: {
            [Op.or]: [
              {
                Titulo: {
                  [Op.like]: `%${filter}%`,
                },
              },
              {
                Autor: {
                  [Op.like]: `%${filter}%`,
                },
              },
              {
                Contenido: {
                  [Op.like]: `%${filter}%`,
                },
              },
            ],
          },
        }
      : { limit: 30 }
  );

  res.send(Fichas);
});

router.get("/consultar/prestamo", async (req, res) => {
  const Prestamos = await DB.registroPrestamos.findAll({
    where: {
      Devolucion: 1,
    },
  });

  res.send(Prestamos);
});

router.post("/registrar/prestamo", async (req, res) => {
  const { ficha, ejemplar, nc, Tipo, Usuario } = req.body;

  const Prestamo = await DB.registroPrestamos
    .create({
      Libro_Numero_Ficha: ficha,
      Libro_Numero_Ejemplar: ejemplar,
      Estudiante_Numero_Control: nc,
    })
    .catch((e) => ({
      Error: "Peticion rechazada",
      Description:
        "Uno o mas valores ingresados no fueron aceptados por falta de coincidencias",
    }));

  res.send(Prestamo);
});

router.put("/renovar/prestamo/:id", async (req, res) => {
  const { id } = req.params;

  const Prestamo = await DB.registroPrestamos.findOne({ where: { Id: id } });

  Prestamo.Renovacion = false;
  Prestamo.Fecha_Devolucion = addDays(new Date(), 2);

  await Prestamo.save();

  res.send(Prestamo);
});

router.put("/devolver/prestamo/:id", async (req, res) => {
  const { id } = req.params;

  const Prestamo = await DB.registroPrestamos.findOne({ where: { Id: id } });

  Prestamo.Devolucion = false;

  await Prestamo.save();

  res.send(Prestamo);
});

export default router;
