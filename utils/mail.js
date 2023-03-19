nodemailer = require("nodemailer");
bcrypt = require("bcrypt");
jwt = require("jsonwebtoken");
const frontUrl = "http://localhost:3000";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTls: true,
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
sendConfirmationEmail = (user) => {
  const name = user.name || user.fullName;
  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "email activation",
    html: ` <h1>Email Confirmation</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
       
        <a href=${frontUrl}/login> Click here</a>
        </div>`,
  });
};
sendAffirmationEmail = (user) => {
  const name = user.fullName;
  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "account confirmation",
    html: ` <h1>Congratulations your account has ben confirmed</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href=${frontUrl}/login> Click here</a>
        </div>`,
  });
};
sendRestEmail = (email) => {
  const code = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "rest password",
    html: ` <h1>Email Confirmation</h1>
        <h2>Hello </h2>
        <p>you can rest your password  by clicking on the following link</p>
        <a href=${frontUrl}/reset2/${code}> Click here</a>
        </div>`,
  });
};
module.exports = { sendConfirmationEmail, sendRestEmail, sendAffirmationEmail };
