const express = require("express");
const cors = require("cors");
//const morgan = require('morgan');

const app = express();

//Settings
app.set("port", process.env.PORT ?? 4200);
app.set("ip", process.env.IP ?? "localhost");
app.use(cors());

//Middlewares
//app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Routes
app.use("/libros", require("./rutas/libros"));
app.use("/alumnos", require("./rutas/alumnos"));
app.use("/servicios", require("./rutas/servicios"));
app.use("/gestionar", require("./rutas/gestionar"));
app.use("/usuarios", require("./rutas/usuarios"));

//Starting server
app.listen(app.get("port"), () => {
  console.log("Server on PORT", app.get("ip"), app.get("port"));
});
