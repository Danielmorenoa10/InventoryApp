import express from "express";
import csurf from "csurf";
import cookieParser from "cookie-parser";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import assetsRoutes from "./routes/assetsRoutes.js"
import db from "./config/db.js";

//crear la app

const app = express();

//habilitar lectura de formularios
app.use(express.urlencoded({ extended: true }));

//habilitar cookieParser
app.use(cookieParser())

//habilitar CSRF
app.use( csurf ({cookie: true}))

//conexion a la base de datos

try {
  await db.authenticate();
  db.sync();
  console.log("Conexión correcta a la base de datos :)");
} catch (error) {
  console.log(error);
}

//habilitar pug
app.set("view engine", "pug");
app.set("views", "./views");

//carpeta publica

app.use(express.static("public"));

//routing
app.use("/auth", usuarioRoutes);
app.use("/", assetsRoutes);

//definir puerto y arrancar proyecto

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`El servidor esta corriendo en el puerto ${port}`);
});
