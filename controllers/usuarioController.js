import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";
import { generarJWT, generarId } from "../helpers/tokens.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/email.js";

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Iniciar Sesión",
    csrfToken: req.csrfToken(),
    usuario: req.user,
  });
};

const autenticar = async (req, res) => {
  //validacion
  await check("email")
    .isEmail()
    .withMessage("El email es obligatorio")
    .run(req);
  await check("contraseña")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .run(req);

  let resultado = validationResult(req);

  //verificar que el resultado este vacio

  if (!resultado.isEmpty()) {
    return res.render("auth/login", {
      pagina: "inciar sesion",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    });
  }
  const { email, contraseña } = req.body;

  //comprobar si el usuario existe
  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) {
    return res.render("auth/login", {
      pagina: "Iniciar Sesión",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "El usuario no existe" }],
    });
  }

  //comprobar si el usuario está confirmado
  if (!usuario.confirmado) {
    return res.render("auth/login", {
      pagina: "iniciar sesión",
      csrfToken: req.csrfToken(),
      errrores: [{ msg: "la cuenta no esta confirmada" }],
    });
  }

  //verificar el Password
  if (!usuario.verificarPassword(contraseña)) {
    return res.render("auth/login", {
      pagina: "inciar sesión",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "Contraseña incorrecta" }],
    });
  }

  //autenticar el usuario
  const token = generarJWT({ id: usuario.id, usuario: usuario.usuario });

  console.log(token);

  //Almacenar en un cookie
  return res
    .cookie("_token", token, {
      hhtpOlnly: true,
      secure: true, //habilitar para deploy 'no util en local por el certifcado SSL'
    })
    .redirect("/assets");
};

const formularioRegistro = (req, res) => {
  res.render("auth/registro", {
    pagina: "Crear cuenta",
    csrfToken: req.csrfToken(),
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
    .withMessage("El correo ingresado no es válido")
    .run(req);
  await check("password")
    .isLength({ min: 6 })
    .withMessage("El Password debe tener al menos 6 caracteres")
    .run(req);
  await check("repetir_password")
    .equals(req.body.password)
    .withMessage("Las contraseñas no coinciden")
    .run(req);
  await check("ubicacion")
    .notEmpty()
    .withMessage("La ubicación es obligatoria")
    .run(req);

  let resultado = validationResult(req);

  //verificar que el resultado esté vacio
  if (!resultado.isEmpty()) {
    //errores
    return res.render("auth/registro", {
      pagina: "Crear cuenta",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
      usuario: {
        campousuario: req.body.usuario,
        email: req.body.email,
        ubicacion: req.body.ubicacion,
      },
    });
  }

  //extraer datos
  const { usuario, email, password, ubicacion } = req.body;

  //verificar que el usuario no esté duplicado
  const existeUsuario = await Usuario.findOne({ where: { email } });
  if (existeUsuario) {
    return res.render("auth/registro", {
      pagina: "Crear cuenta",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "El usuario ya existe" }],
      usuario: {
        campousuario: req.body.usuario,
        email: req.body.email,
      },
    });
  }

  //almacenar usuario
  const user = await Usuario.create({
    usuario,
    email,
    password,
    ubicacion,
    token: generarId(),
  });

  //enviar email de confirmación
  emailRegistro({
    usuario: user.usuario,
    email: user.email,
    ubicacion: user.ubicacion,
    token: user.token,
  });

  // Mostrar mensaje de confirmación
  res.render("plantillas/mensaje", {
    pagina: "Cuenta Creada Correctamente",
    mensaje: "Hemos Enviado un Email de Confirmación, presiona en el enlace",
  });
};

//Comprobar cuenta
const confirmar = async (req, res) => {
  const { token } = req.params;

  //verificar si el token es válido
  const usuario = await Usuario.findOne({ where: { token } });

  console.log(usuario);

  if (!usuario) {
    return res.render("auth/confirmar-cuenta", {
      pagina: "Error al confirmar tu cuenta",
      mensaje: "Hubo un error al confirmar tu cuenta.",
      error: true,
    });
  }

  //confirmar la cuenta

  usuario.token = null;
  usuario.confirmado = true;
  await usuario.save();
  res.render("auth/confirmar-cuenta", {
    pagina: "Cuenta confirmada",
    mensaje: "La cuenta ha sido confirmada correctamente",
  });
};

const formularioOlvidePassword = (req, res) => {
  res.render("auth/olvide-password", {
    pagina: "Recuperar contraseña",
    csrfToken: req.csrfToken(),
  });
};

const resetPassword = async (req, res) => {
  //validacion

  await check("email")
    .isEmail()
    .withMessage("El correo ingresado no es válido")
    .run(req);

  let resultado = validationResult(req);

  //verificar que el resultado esté vacio
  if (!resultado.isEmpty()) {
    //errores
    return res.render("auth/olvide-password", {
      pagina: "Crear cuenta",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
      pagina: "Recuperar contraseña",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    });
  }

  //buscar el usuario

  const { email } = req.body;

  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) {
    return res.render("auth/olvide-password", {
      pagina: "Recupera tu contraseña",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "El Email no Pertenece a ningún usuario" }],
    });
  }

  //generar un token y enviar el email
  usuario.token = generarId();
  await usuario.save();

  //enviar un email

  emailOlvidePassword({
    email: usuario.email,
    nombre: usuario.usuario,
    token: usuario.token,
  });

  //mostrar mensaje de confirmacion
  res.render("plantillas/mensaje", {
    pagina: "Reestablecer tu contraseña",
    mensaje: "Hemos enviado un email con las instrucciones",
  });
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;

  const usuario = await Usuario.findOne({ where: { token } });
  if (!usuario) {
    return res.render("auth/confirmar-cuenta", {
      pagina: "Reestablecer tu contraseña",
      mensaje: "Hubo un error al validar tu información, intenta de nuevo",
      error: true,
    });
  }

  //mostrar formulario para modificar el password
  res.render("auth/reset-password", {
    pagina: "Reestablece tu password",
    csrfToken: req.csrfToken(),
  });
};

const nuevoPassword = async (req, res) => {
  //validar el password

  await check("password")
    .isLength({ min: 6 })
    .withMessage("El password debe ser de al menos 6 caracteres")
    .run(req);
  let resultado = validationResult(req);

  //verificar que el resultado este vacio

  if (!resultado.isEmpty()) {
    //errores
    return res.render("auth/reset-password", {
      pagina: "reestablece tu contraseña",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    });
  }

  const { token } = req.params;
  const { password } = req.body;

  //identificar quien hace el cambio

  const usuario = await Usuario.findOne({ where: { token } });

  // Hashear el nuevo password
  const salt = await bcrypt.genSalt(10);
  usuario.password = await bcrypt.hash(password, salt);
  usuario.token = null;  

  await usuario.save();

  res.render("auth/confirmar-cuenta", {
    pagina: "Password Reestablecido",
    mensaje: "El Password se guardó correctamente",
  });
};

export {
  formularioLogin,
  formularioRegistro,
  formularioOlvidePassword,
  autenticar,
  registrar,
  confirmar,
  resetPassword,
  comprobarToken,
  nuevoPassword,
};
