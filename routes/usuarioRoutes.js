import express from "express";
import {
  formularioLogin,
  formularioRegistro,
  recuperacionPassword,
} from "../controllers/usuarioController.js";

const router = express.Router();

router.get("/login", formularioLogin);
router.get("/registro", formularioRegistro);
router.get("/recuperacionPassword", recuperacionPassword);

export default router;
