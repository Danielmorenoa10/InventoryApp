const formularioLogin = (req, res) => {
  res.render("auth/login", {
    pagina: 'Iniciar Sesión'

  })
};

const formularioRegistro = (req, res) => {
  res.render('auth/registro', {
      pagina : 'Registro'
  })
};

const recuperacionPassword = (req, res) => {
  res.render('auth/recuperacionPassword', {
      pagina : 'Recuperar contraseña'
  })
};

export {
  formularioLogin,  
  formularioRegistro,
  recuperacionPassword,
}