import { Router } from "express";
import {
  crearMensaje,
  leerMensajes,
} from "../controllers/mensaje.controller.js";
import checkAuth from "../middlewares/authMiddleware.js";
const router = Router();

router
  .post("/nuevo", checkAuth, crearMensaje)
  .get("/listado", checkAuth, leerMensajes);

export default router;
