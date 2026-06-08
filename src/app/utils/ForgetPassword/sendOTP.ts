import nodemailer from "nodemailer"
import { envVars } from "../../config/env"

export const sendEmail = async (to: string, subject: string, html: string) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: envVars.ADMIN_EMAIL,
            pass: envVars.APP_PASSWORD
        }
    })

    await transporter.sendMail({
        from: envVars.ADMIN_EMAIL,
        to,
        subject,
        html
    })
}