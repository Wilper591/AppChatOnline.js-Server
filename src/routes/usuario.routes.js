import { Router } from "express";
import {
  crearUsuario,
  iniciarSesion,
  perfilUsuario,
} from "../controllers/usuario.controller.js";
import checkAuth from "../middlewares/authMiddleware.js";
const router = Router();

router
  .post("/login", iniciarSesion)
  .post("/registro", crearUsuario)
  .get("/perfil", checkAuth, perfilUsuario);

export default router;
