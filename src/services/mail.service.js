import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
import Mailgen from 'mailgen';

const sendTicketByEmail = async (destinatario, ticket) => {
  try {
    let config = {
      service: 'gmail',
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS,
      },
    };

    let transporter = nodemailer.createTransport(config);

    let Mailgenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'Codershop',
        link: 'http://www.coderhouse.com',
      },
    });

    let response = {
      body: {
        intro: "Your ticket details are as follows:",
        table: {
          data: ticket.products.map((product) => ({
            item: product.title,
            description: product.description,
            picture: product.thumbnails,
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
    return { success: false, error: err.message };
  }
};

export default sendTicketByEmail;

