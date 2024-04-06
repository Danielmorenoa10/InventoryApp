import express from "express";
import { home, crear } from "../controllers/assetsController.js";
const router = express.Router();


router.get("/assets", home);
router.get("/assets/crear", crear);

export default router;
