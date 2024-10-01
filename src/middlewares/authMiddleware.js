import jwt from "jsonwebtoken";
import { Usuario } from "../models/Usuario.js";
import dotenv from "dotenv";
dotenv.config();

const checkAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      req.usuario = await Usuario.findByPk(decoded.id, {
        attributes: { exclude: ["password"] },
      });

      next();
    } catch (error) {
      console.error("Error en la verificación del token:", error);
      res.status(403).json({ msg: "Token no válido" });
    }
  }
};

export default checkAuth;
