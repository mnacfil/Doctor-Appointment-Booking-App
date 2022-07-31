const nodemailer = require('nodemailer')
const nodemailerConfig = require('./nodemailerConfig')

const sendEmail = async ({from, to, subject, html}) => {
    let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport(nodemailerConfig);

  // send mail with defined transport object
    return transporter.sendMail({
        from,
        to,
        subject,
        html
    })
}

module.exports = sendEmail