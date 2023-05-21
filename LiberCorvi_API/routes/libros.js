import { Router } from "express";
const router = Router();

import { DataTypes, Op, QueryTypes, Sequelize, literal } from "sequelize";
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
              fe.Disponibilidad,
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

    res.send({
      Success: "Libro valido",
      Msg: "Desplegando lista de libros",
      Lista,
    });
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
  const { libro, autor, contenido } = req.query;
  const Fichas = await DB.fichaLibros.findAll(
    libro != "" || autor != "" || contenido != ""
      ? {
          limit: 50,
          where: {
            [Op.and]: [
              {
                Titulo: {
                  [Op.like]: `%${libro}%`,
                },
              },
              {
                Autor: {
                  [Op.like]: `%${autor}%`,
                },
              },
              {
                Contenido: {
                  [Op.like]: `%${contenido}%`,
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
    include: {
      model: DB.alumnos,
      required: true,
      attributes: [
        [
          DB.conn.fn(
            "concat",
            DB.conn.col("Nombre"),
            " ",
            DB.conn.col("Apellido_Paterno"),
            " ",
            DB.conn.col("Apellido_Materno")
          ),
          "Nombre",
        ],
      ],
    },
    where: {
      Devolucion: 1,
    },
    raw: true,
  });

  res.send(Prestamos);
});

router.get("/consultar/prestamo/:nc", async (req, res) => {
  const { nc } = req.params;
  const Prestamos = await DB.registroPrestamos.findAll({
    include: {
      model: DB.alumnos,
      required: true,
      attributes: [
        [
          DB.conn.fn(
            "concat",
            DB.conn.col("Nombre"),
            " ",
            DB.conn.col("Apellido_Paterno"),
            " ",
            DB.conn.col("Apellido_Materno")
          ),
          "Nombre",
        ],
      ],
    },
    where: {
      [Op.and]: [{ Devolucion: 1 }, { Estudiante_Numero_Control: nc }],
    },
    raw: true,
  });

  res.send(Prestamos);
});

router.post("/registrar/prestamo", async (req, res) => {
  const { ficha, ejemplar, nc, Tipo } = req.body;

  const Prestamo = await DB.registroPrestamos
    .create({
      Libro_Numero_Ficha: ficha,
      Libro_Numero_Ejemplar: ejemplar,
      Estudiante_Numero_Control: nc,
      Interno: Tipo ?? false,
    })
    .catch((e) => ({
      Error: "Peticion rechazada",
      Description:
        "Uno o mas valores ingresados no fueron aceptados por falta de coincidencias",
    }));

  await DB.fichaEjemplares.update(
    { Disponibilidad: false },
    {
      where: {
        [Op.and]: [{ Numero_Adquisicion: ejemplar }, { Numero_Ficha: ficha }],
      },
    }
  );

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

  await DB.fichaEjemplares.update(
    { Disponibilidad: true },
    {
      where: {
        [Op.and]: [
          { Numero_Adquisicion: Prestamo.Libro_Numero_Ejemplar },
          { Numero_Ficha: Prestamo.Libro_Numero_Ficha },
        ],
      },
    }
  );

  await Prestamo.save();

  res.send(Prestamo);
});

export default router;
