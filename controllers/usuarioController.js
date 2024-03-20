import { check, validationResult } from 'express-validator'
import Usuario from '../models/Usuario.js'

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Iniciar Sesión",
  });
};

const formularioRegistro = (req, res) => {
  res.render("auth/registro", {
    pagina: "Crear cuenta",
  })
}

const registrar = async (req, res) => {


  //validacion
  await check ('usuario').notEmpty().withMessage('El usuario es obligatorio').run(req)
  await check ('email').isEmail().withMessage('El correo que ingreso no es válido').run(req)
  await check ('password').isLength({min: 6}).withMessage('La contraseña debe tener al menos 6 caracteres').run(req)
  await check ('repetir_password').equals('password').withMessage('Las contraseñas deben coincidir :(').run(req)
  await check ('ubicacion').notEmpty().withMessage('La ubicacion es obligatoria').run(req)

  let resultado = validationResult(req)

  //verificar que el resultado esté vacio
  if (!resultado.isEmpty()) {
      //errores
      return res.render('auth/registro', {
        pagina: 'Crear cuenta',
        errores: resultado.array()
      })
  }


  const usuario = await Usuario.create(req.body);
  res.json(usuario)
}

const recuperacionPassword = (req, res) => {
  res.render("auth/recuperacionPassword", {
    pagina: "Recuperar contraseña",
  });
};

export { formularioLogin, formularioRegistro, recuperacionPassword, registrar };
