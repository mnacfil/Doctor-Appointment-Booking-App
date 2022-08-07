const sendEmail = require('../sendEmail')

const sendAppointmentToDoctor = ({ email, name, overview, time}) => {

    return sendEmail({
        from: 'Engr Nacfil, || mnacfil@gmail.com',
        to: email,
        subject: "Client appointment",
        html: `<div>
            <h3>Doctor Appoint Booking App</h3>
            <div>
                <p>Hi ${name}</p>
                <br>
                <p>
                    ${overview}
                </p>
                <br>
                <p>
                    ${time}
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

module.exports = sendAppointmentToDoctor