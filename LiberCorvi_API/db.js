import CONN from "./utils/conn.js";

import Alumnos from "./utils/models/alumnos.js";
import fichaEjemplares from "./utils/models/fichaEjemplares.js";
import fichaLibros from "./utils/models/fichaLibros.js";
import registroPrestamos from "./utils/models/registroPrestamos.js";
import registroServicios from "./utils/models/registroServicios.js";
import registroVisitas from "./utils/models/registroVisitas.js";
import servicios from "./utils/models/servicios.js";
import usuarios from "./utils/models/usuarios.js";

const DB = {};

DB.conn = CONN;
DB.alumnos = Alumnos;
DB.fichaEjemplares = fichaEjemplares;
DB.fichaLibros = fichaLibros;
DB.registroPrestamos = registroPrestamos;
DB.registroServicios = registroServicios;
DB.registroVisitas = registroVisitas;
DB.servicios = servicios;
DB.usuarios = usuarios;

//Associations
/* Alumnos.hasMany(registroServicios, {
  foreignKey: "Numero_Control",
  as: "Servicios",
}); */
registroServicios.belongsTo(Alumnos, {
  foreignKey: "Numero_Control",
  as: "Alumno",
});

//Sync DB
await CONN.sync({ force: false });

export default DB;
