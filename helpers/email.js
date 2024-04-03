import nodemailer from "nodemailer";
const emailRegistro = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.email_host,
    port: process.env.email_port,
    auth: {
      user: process.env.email_user,
      pass: process.env.email_pass,
    },
  });

  const { email, usuario, token } = datos;

  //enviar email
  await transport.sendMail({
    from: "inventoryappml.com",
    to: email,
    subject: "Confirma tu cuenta en inventoryappml.com",
    text: "Confirma tu cuenta en inventoryappml.com",
    html: `
              <p> ¡Hola ${usuario}!, esperamos que estés muy bien ;)</p>  
              <p> Para continuar con tu registro, debes confirmar tu cuenta:
              <a href="${process.env.BACKEND_URL}:${
      process.env.PORT ?? 3000
    }/auth/confirmar/${token}">Confirmar la Cuenta</a>
              </p>
              <p>Si tú no creaste esta cuenta, puedes ignorar este mensaje.</p>
              br
  
        `,
  });
};

const emailOlvidePassword = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.email_host,
    port: process.env.email_port,
    auth: {
      user: process.env.email_user,
      pass: process.env.email_pass,
    },
  });

  const { email, nombre, token } = datos;

  //enviar email
  await transport.sendMail({
    from: "inventoryappml.com",
    to: email,
    subject: "Reestablece tu cuenta en inventoryappml.com",
    text: "Reestablece tu cuenta en inventoryappml.com",
    html: `
            <p>Hola ${nombre}, has solicitado reestablecer tu password en InventoryAppml.com</p>

            <p>Sigue el siguiente enlace para generar un password nuevo: 
            <a href="${process.env.BACKEND_URL}:${
      process.env.PORT ?? 3000
    }/auth/olvide-password/${token}">Reestablecer Password</a> </p>

            <p>Si tu no solicitaste el cambio de password, puedes ignorar el mensaje</p>
        `,
  });
};

export { emailRegistro, emailOlvidePassword };
