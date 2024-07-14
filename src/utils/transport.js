import config from "../config/config.js";
import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false,  // true para 465, false para otros puertos
    auth: {
        user: config.email_sender,
        pass: config.email_pass
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    } 
});

export default transport;