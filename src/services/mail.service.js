import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
import Mailgen from 'mailgen';
import logger from '../utils/logger.js';


const sendTicketByEmail = async (destinatario, ticket) => {
  try {
    let config = {
      service: 'gmail',
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      }
  }

    let transporter = nodemailer.createTransport(config);

    let Mailgenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'Codershop',
        link: 'http://www.coderhouse.com',
      },
    });

    //logger.info('ticket dentro del service', ticket)

    let response = {
      body: {
        intro: "Your ticket details are as follows:",
        table: {
          data: ticket.products.map((product) => ({
            item: product.product,
            price: `$${product.price}`,
            quantity: product.quantity,
          })),
        },
        outro: `Total Amount: $${ticket.amount.toFixed(2)}`,
      },
    };

    let mail = Mailgenerator.generate(response);

    let message = {
      from: 'Coder Shop',
      to: destinatario,
      subject: `EL ${ticket.code} es el ticket de su compra`,
      html: mail,
    };

    await transporter.sendMail(message);
    return { success: true, message: 'Email sent successfully' };
  } catch (err) {
    logger.error('error al generar mail', err)
    return { success: false, error: err.message };
  }
};

export const restorePasswordMail = async (destinatario, token) => {
  try {
  const mailerConfig = {
    service: 'gmail',
    auth: { 
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS },
      tls: {
        rejectUnauthorized: false,
      }
}
  let transporter = nodemailer.createTransport(mailerConfig)
  let Mailgenerator = new Mailgen({
    theme: 'default',
    product: {
      name: 'Codershop',
      link: 'http://www.coderhouse.com',
    },
  });
  //console.log ('token',token)

  let response = {
    body:{
      intro: "este es el link para re establecer tu contraseña",
      action: {
        instructions: 'Hace click en el boton para resetear la clave',
        button: {
            color: '#DC4D2F',
            text: 'Reset your password',
            link: `http://localhost:8080/reset-password/${token}`
        }
        },
      outro: 'Si no pediste un cambio de contraseña desestima este e-mail'
    }
  }
  let mail = Mailgenerator.generate(response)

let message = {
    from: 'Coder Shop',
    to: destinatario,
    subject: 'Link para reset de tu password',
    html: mail
}
    await transporter.sendMail(message)
    return { success: true, message: 'Email enviado con exito' };
} catch (err) {
  logger.error('error al generar mail', err)
  return { success: false, error: err.message }
}
}

export default sendTicketByEmail