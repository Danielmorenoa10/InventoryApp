import { exit } from "node:process";
import ubicaciones from "./ubicaciones.js";
import estados from "./estados.js";
import estado from "../models/estado.js";
import ubicacion from "../models/ubicacion.js";
import db from "../config/db.js";

const importarDatos = async () => {
  try {
    //autenticar
    await db.authenticate();
    //generar las columnas
    await db.sync();
    //insertamos los datos
    await Promise.all([
      ubicacion.bulkCreate(ubicaciones),
      estado.bulkCreate(estados),
    ]);

    console.log("Datos importados correctamente");
    exit();
  } catch (error) {
    console.log(error);
    exit(1);
  }
};

const eliminarDatos = async () => {
  try {
    await db.sync({ force: true })
    console.log("Datos eliminados correctamente");
    exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

if (process.argv[2] === "-i") {
  importarDatos();
}

if (process.argv[2] === "-e") {
  eliminarDatos();
}
