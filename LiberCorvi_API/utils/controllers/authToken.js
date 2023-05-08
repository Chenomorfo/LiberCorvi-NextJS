import jwt from "jsonwebtoken";
import { SECRET } from "../config.js";
import DB from "../../db.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];

    if (!token) return res.status(403).json({ Msg: "No token provided" });

    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.Id;

    const Usuario = await DB.usuarios.findOne({ where: { Id: req.userId } });

    if (!Usuario)
      return res.status(404).json({ message: "Usuario no encontrado" });

    req.User = Usuario.dataValues;
    next();
  } catch (error) {
    return res.status(401).json({
      Error: "Invalid Token",
      Msg: "Token unauthorized or already expired",
    });
  }
};
