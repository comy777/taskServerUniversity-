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
  const urlLocal = `http://localhost:5050/auth/validate-email/${token}`;
  const url = `https://task-university.herokuapp.com/auth/validate-email/${token}`;
  return await transporter.sendMail({
    from: '"Fred Foo 👻" <taskserveruniversity@gmail.com>',
    to: email,
    subject: "Validar correo electronico",
    html: `
      <b>Please click on the following link, or paste this into your browser to complete the process:</b>
      <hr/>
      <br/>
      <a href="${url}" >
        Verificar correo electronico
      </a>
    `,
  });
};

export const sendEmailPassword = async (email: string, token: string) => {
  const urlLocal = `http://localhost:5050/auth/reset-password/${token}`;
  const url = `https://task-university.herokuapp.com/auth/reset-password/${token}`;
  return await transporter.sendMail({
    from: '"Fred Foo 👻" <taskserveruniversity@gmail.com>',
    to: email,
    subject: "Recuperar contraseña",
    html: `
      <b>Please click on the following link, or paste this into your browser to complete the process:</b>
      <hr/>
      <br/>
      <a href="${url}" >
        Recuperar contraseña      
      </a>
    `,
  });
};
