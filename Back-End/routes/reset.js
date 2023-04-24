const { Router } = require("express");
const router = Router();

const pool = require("../dbConn");

const VisitasJSON = require("../../StaticData/registros.json");
const AlumnosJSON = require("../../StaticData/escuela.json");
const RegistroServicios = require("../../StaticData/registroServicios.json");

const FichaLibros = require("../resetData/NuevasFichas.json");
const FichaEjemplares = require("../resetData/FichaEjemplares.json");

router.get("/", (req, res) => {
  res.send("API reseteo");
});

router.get("/servicios", async (req, res) => {
  let servicios = [];
  for (let i = 0; i < 5; i++) {
    servicios.push(["Cubiculo", i + 1]);
  }

  for (let i = 0; i < 3; i++) {
    servicios.push(["Mesa", i + 1]);
  }
  servicios.push(["Restirador", 1]);
  servicios.push(["Restirador", 2]);

  for (let i = 0; i < 13; i++) {
    servicios.push(["Laptop", i + 1]);
  }
  for (let i = 0; i < 12; i++) {
    servicios.push(["Computadora", i + 1]);
  }

  await pool.query("DELETE FROM Servicio");
  await pool.query("INSERT INTO Servicio (Area, Numero) VALUES ?", [servicios]);

  res.send("Tablas reseteadas");
});

router.get("/visitas", async (req, res) => {
  let arr = VisitasJSON.map((item) => {
    let fecha = `${item.year}-${item.month + 1}-${item.day}`;
    return [fecha, item.hombres, item.mujeres];
  });

  await pool.query("DELETE FROM RegistroVisitas");
  await pool.query(
    "INSERT INTO RegistroVisitas (Fecha, Cant_Hombres, Cant_Mujeres) VALUES ?",
    [arr]
  );

  res.send("Registros reiniciados");
});

router.get("/estudiantes", async (req, res) => {
  let arr = AlumnosJSON.map((item) => {
    return [
      item.Ncontrol,
      item.Nombre,
      item.Sexo == "H" ? 1 : 0,
      item.Especialidad,
      item.Semestre,
    ];
  });

  await pool.query("INSERT INTO Estudiante VALUES ?", [arr]);

  res.send({ msg: "Alumnos ingresados" });
});

router.get("/registroServicios", async (req, res) => {
  let arr = RegistroServicios.map(({ fecha, ncontrol, servicio }) => {
    return [ncontrol, fecha, servicio];
  });

  await pool.query("INSERT INTO RegistroServicios VALUES ?", [arr]);

  res.send({ msg: "Servicios ingresados" });
});

router.get("/fichaLibros", async (req, res) => {
  await pool.query("DELETE FROM FichaLibros");

  console.clear();

  let fichas = FichaLibros;
  const quarter = Math.ceil(fichas.length / 4);

  const firstHalf = fichas.splice(-quarter);
  const secondHalf = fichas.splice(-quarter);
  const thirdHalf = fichas.splice(-quarter);
  const lastHalf = fichas;

  await pool.query("INSERT INTO FichaLibros VALUES ?", [lastHalf]);
  await pool.query("INSERT INTO FichaLibros VALUES ?", [thirdHalf]);
  await pool.query("INSERT INTO FichaLibros VALUES ?", [secondHalf]);

  firstHalf.forEach(async (element) => {
    try {
      await pool.query("INSERT INTO FichaLibros VALUES (?)", [element]);
    } catch (error) {
      console.log(error); 
    }
  });

  res.send({ msg: "Carga Finalizada" });
});

router.get("/fichaEjemplares", async (req, res) => {
  await pool.query("DELETE FROM FichaEjemplares");

  let ejemplares = FichaEjemplares;
  
  const tenXamples = Math.ceil(ejemplares.length / 10);

  for (let i = 0; i < 10; i++) {
    let splicedArr = i == 9 ? ejemplares : ejemplares.splice(-tenXamples);
    await pool.query("INSERT INTO FichaEjemplares VALUES ?", [splicedArr]);
  }

  res.send({ msg: "Carga Finalizada" });
});

module.exports = router;
