import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

const sendMail = async (to, subject, html) => {
    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html
    })
}

const sendVerificationEmail = async (email, token) => {
    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        email,
        subject,
        html
    })
}

export {
    sendMail,
    sendVerificationEmail
}