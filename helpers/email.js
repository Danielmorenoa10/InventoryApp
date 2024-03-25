import nodemailer from "nodemailer";
const emailRegistro = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.email_host,
        port: process.env.email_port,
        auth: {
          user: process.env.email_user,
          pass: process.env.email_pass,
        }
      });

      const {email, usuario, token} = datos 

      //enviar email 
      await transport.sendMail ({
      from: 'inventoryappml.com',
      to: email,
      subjet: 'Confirma tu cuenta en inventoryappml.com',
      text: 'Confirma tu cuenta en inventoryappml.com',
      html: `
            <p> !Hola ${usuario}!, esperamos que estés muy bien ;)</p>
            <p> debes confirmar tu cuenta ok?</p>
            <p> Para continuar tu registro debes confirmar tu cuenta
            <button name="confirmar">Confirmar la Cuenta </button>
            </p>
            <p>Si tu no creaste esta cuenta puedes ignorar el mensaje</a>
      `
    })
};

export { emailRegistro };
