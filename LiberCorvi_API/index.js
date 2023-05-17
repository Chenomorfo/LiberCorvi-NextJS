import express from "express";
import cors from "cors";
import { Server as SocketServer } from "socket.io";
import http from "http";
import sockets from "./utils/sockets.js";

//RoutesController
import DefaultRouteController from "./routes/_defaultValues.js";
import AlumnosRouteController from "./routes/alumnos.js";
import GestionesRouteController from "./routes/gestionar.js";
import LibrosRouteController from "./routes/libros.js";
import UsuariosRouteController from "./routes/usuarios.js";
import ServiciosRouteController from "./routes/servicios.js";
import TestRouteController from "./routes/test.js";

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

//configs
app.use(cors());

//middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

(() => {
  //routes
  app.use("/default", DefaultRouteController);
  app.use("/alumnos", AlumnosRouteController);
  app.use("/gestionar", GestionesRouteController);
  app.use("/libros", LibrosRouteController);
  app.use("/usuarios", UsuariosRouteController);
  app.use("/servicios", ServiciosRouteController);
  app.use("/test", TestRouteController);
})();
//Socket.io
sockets(io);

//Network
import { networkInterfaces } from "os";

const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
    // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
    const familyV4Value = typeof net.family === "string" ? "IPv4" : 4;
    if (net.family === familyV4Value && !net.internal) {
      results[name] = net.address;
    }
  }
}
//init server
server.listen(4200, () => {
  console.log("server on http://localhost:" + 4200);

  console.log(
    "For LAN connection:",
    "http://" + results["Ethernet"] + ":" + 4200
  );
});
