import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "taskserveruniversity@gmail.com",
    pass: process.env.PASSWORD_EMAIL,
  },
});

export const sendVerification = async (email: string, token: string) => {
  return await transporter.sendMail({
    from: '"Fred Foo 👻" <taskserveruniversity@gmail.com>',
    to: email,
    subject: "Validar correo electronico",
    html: `
      <b>Please click on the following link, or paste this into your browser to complete the process:</b>
      <hr/>
      <br/>
      <a href="https://task-university.herokuapp.com/auth/validate-email/${token}" >
        Verificar correo electronico
      </a>
    `,
  });
};
