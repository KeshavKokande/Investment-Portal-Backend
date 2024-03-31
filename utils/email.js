const nodemailer = require("nodemailer");

// const sendEmail = async (options) => {
//     // 1. Create a transporter
//     const transporter = nodemailer.createTransport ({
//         host: process.env.EMAIL_HOST,
//         port: process.env.EMAIL_PORT,
//         auth: {
//             user: process.env.EMAIL_USERNAME,
//             pass: process.env.EMAIL_PASSWORD
//         }
//         // Activate in gmail "less secure app" option
//     })

//     // 2. Define the email options
//     const mailOptions = {
//         from: 'Shubham Goswami <shubhambtps588@gmail.com>',
//         to: options.email,
//         subject: options.subject,
//         text: options.message,
//         // html: 
//     }

//     // 3. Actually send the email
//     await transporter.sendMail(mailOptions)
// }

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        },
    });

    // 2. Define the email options
    const mailOptions = {
        from: 'info@mailtrap.club <mailtrap@sdmds.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: 
    }

    // 3. Actually send the email
    await transporter.sendMail(mailOptions)

    console.log("Message sent: %s", info.messageId);
}

module.exports = sendEmail;