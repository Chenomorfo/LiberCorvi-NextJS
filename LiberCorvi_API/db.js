import CONN from "./utils/conn.js";

import Alumnos from "./utils/models/alumnos.js";
import fichaEjemplares from "./utils/models/fichaEjemplares.js";
import Ficha_Libros from "./utils/models/fichaLibros.js";
import fichaLibros from "./utils/models/fichaLibros.js";
import registroPrestamos from "./utils/models/registroPrestamos.js";
import registroServicios from "./utils/models/registroServicios.js";
import registroVisitas from "./utils/models/registroVisitas.js";
import RFID from "./utils/models/rfid.js";
import Roles from "./utils/models/roles.js";
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
DB.roles = Roles;
DB.rfid = RFID;
//Associations
/* Alumnos.hasMany(registroServicios, {
  foreignKey: "Numero_Control",
  as: "Servicios",
}); */
registroServicios.belongsTo(Alumnos, { foreignKey: "Numero_Control" });
registroServicios.belongsTo(registroPrestamos, { foreignKey: "Prestamo" });
registroPrestamos.hasOne(registroServicios, { foreignKey: "Prestamo" });
Alumnos.hasMany(registroServicios, { foreignKey: "Numero_Control" });

registroPrestamos.belongsTo(Alumnos, {
  foreignKey: "Estudiante_Numero_Control",
});

usuarios.belongsTo(Roles, { foreignKey: "Rol" });

RFID.belongsTo(Alumnos, { foreignKey: "Numero_Control" });
Alumnos.hasOne(RFID, { foreignKey: "Numero_Control" });

/* usuarios.hasOne(Roles, {
  foreignKey: "Rol",
}); */

//Ficha_Libros.hasMany(fichaEjemplares, { foreignKey: "Numero_Ficha" });

//Sync DB
await CONN.sync();

export default DB;
