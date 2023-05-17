const PORT = 4200;

//const DIR = "localhost";
const DIR = "192.168.1.186";

export const API = `http://${DIR}:${PORT}`;

export const AlumnosAPI = `${API}/alumnos`;
export const GestionarAPI = `${API}/gestionar`;
export const LibrosAPI = `${API}/libros`;
export const UsuariosAPI = `${API}/usuarios`;
export const ServiciosAPI = `${API}/servicios`;
