// const nodemailer = require("nodemailer");

// const sendEmail = async (options) => {
//     const transporter = nodemailer.createTransport({
//         host: process.env.EMAIL_HOST,
//         port: process.env.EMAIL_PORT,
//         secure: false, // Use `true` for port 465, `false` for all other ports
//         auth: {
//             user: process.env.EMAIL_USERNAME,
//             pass: process.env.EMAIL_PASSWORD
//         },
//     });

//     // 2. Define the email options
//     const mailOptions = {
//         from: 'info@mailtrap.club <mailtrap@sdmds.com>',
//         to: options.email,
//         subject: options.subject,
//         text: options.message,
//         // html: 
//     }

//     // 3. Actually send the email
//     await transporter.sendMail(mailOptions)

//     console.log("Message sent: %s", info.messageId);
// }

// module.exports = sendEmail;

const nodemailer = require('nodemailer');

const mailSender = async (email, title, body) => {
  try {
    // Create a Transporter to send emails
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      }
    });
    // Send emails to users
    let info = await transporter.sendMail({
      from: 'investincedo@gmail.com inVest Inc',
      to: email,
      subject: title,
      html: body,
    });
    console.log("Email info: ", info);
    return info;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = mailSender;