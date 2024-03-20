import express from "express";
import {
  formularioLogin,
  formularioRegistro,
  recuperacionPassword,
  registrar,
} from "../controllers/usuarioController.js";

const router = express.Router();

router.get("/login", formularioLogin)

router.get('/registro', formularioRegistro)
router.post("/registro", registrar)

router.get("/recuperacionPassword", recuperacionPassword)

export default router;
