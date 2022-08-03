const sendEmail = require('../sendEmail')

const sendEmailVerification = ({origin, email, name, verificationToken}) => {

    const emailPath = `${origin}/verify-email?token=${verificationToken}&email=${email}`

    return sendEmail({
        from: 'Engr Nacfil, || mnacfil@gmail.com',
        to: email,
        subject: "Email Verification",
        html: `<div>
            <h3>Doctor Appoint Booking App</h3>
            <div>
                <p>Hi ${name}</p>
                <br>
                <p>
                    We're happy you signed up for Doctor Booking app. To start booking, please confirm your email address.
                </p>
                <br>
                <p>
                    <a href="${emailPath}">Verify now</a>
                </p>
                <br>
                <p>
                    Welcome to Doctor Booking App!
                </p>
                <p>Melvin Nacfil</p>
            </div>
        </div>`
    })
}

module.exports = sendEmailVerification