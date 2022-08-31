const sendEmail = require('../sendEmail')

const sendForgotPasswordLink = ({origin, email, name, passwordVerificationToken}) => {

    const resetPasswordPath = `${origin}/reset-password?token=${passwordVerificationToken}&email=${email}`

    return sendEmail({
        from: 'Engr Nacfil, || mnacfil@gmail.com',
        to: email,
        subject: "Reset Password link",
        html: `<div>
            <h3>Doctor Appoint Booking App</h3>
            <div>
                <p>Hi ${name}</p>
                <br>
                <p>
                    To change your password, just click the link and you will navigate to reset password page where you can change it. Thanks and have a good day!
                </p>
                <br>
                <p>
                    <a href="${resetPasswordPath}">click here</a>
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

module.exports = sendForgotPasswordLink