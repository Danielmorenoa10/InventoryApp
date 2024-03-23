import { check, validationResult } from "express-validator";
import Usuario from "../models/Usuario.js";
import { generarId } from "../helpers/tokens.js";

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Iniciar Sesión",
  });
};

const formularioRegistro = (req, res) => {
  res.render("auth/registro", {
    pagina: "Crear cuenta",
  });
};

const registrar = async (req, res) => {
  //validacion
  await check("usuario")
    .notEmpty()
    .withMessage("El usuario no puede ir vacio")
    .run(req);
  await check("email")
    .isEmail()
    .withMessage("El corre que ingreso no es valido")
    .run(req);
  await check("password")
    .isLength({ min: 6 })
    .withMessage("El Password debe ser de al menos 6 caracteres")
    .run(req);
  await check("repetir_password")
    .equals(req.body.password)
    .withMessage("Los Passwords no son iguales")
    .run(req);
  await check("ubicacion")
    .notEmpty()
    .withMessage("La ubicacion es obligatoria")
    .run(req);

  let resultado = validationResult(req);

  //verificar que el resultado esté vacio
  if (!resultado.isEmpty()) {
    //errores
    return res.render("auth/registro", {
      pagina: "Crear cuenta",
      errores: resultado.array(),
      usuario: {
        campousuario: req.body.usuario,
        email: req.body.email,
        ubicacion: req.body.ubicacion,
      },
    });
  }

  //extrer datos
  const { usuario, email, password, ubicacion } = req.body;

  //verificar que el usuario no este duplicado
  const existeUsuario = await Usuario.findOne({ where: { email } });
  if (existeUsuario) {
    return res.render("auth/registro", {
      pagina: "crear cuenta",
      errores: [{ msg: "El usuario ya existe" }],
      usuario: {
        campousuario: req.body.usuario,
        email: req.body.email,
      },
    });
  }
  await Usuario.create({
    usuario,
    email,
    password,
    ubicacion,
    token: generarId(),
  });

  //mostrar mensaje de confirmación
  
};

const recuperacionPassword = (req, res) => {
  res.render("auth/recuperacionPassword", {
    pagina: "Recuperar contraseña",
  });
};

export { formularioLogin, formularioRegistro, recuperacionPassword, registrar };
