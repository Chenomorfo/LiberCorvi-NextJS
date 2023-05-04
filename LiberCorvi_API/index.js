import express from "express";
import cors from "cors";

//RoutesController
import DefaultRouteController from "./routes/_defaultValues.js";
import AlumnosRouteController from "./routes/alumnos.js";
import GestionesRouteController from "./routes/gestionar.js";
import LibrosRouteController from "./routes/libros.js";

const app = express();

//configs
app.use(cors());

//middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//routes
app.use("/default", DefaultRouteController);
app.use("/alumnos", AlumnosRouteController);
app.use("/gestionar", GestionesRouteController);
app.use("/libros", LibrosRouteController);

//init server
app.listen(3000, () => console.log("server on port:", 3000));
