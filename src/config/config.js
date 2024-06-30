import * as dotenv from 'dotenv';

dotenv.config();

export default {
    port: process.env.PORT,
    mongoUri: process.env.MONGO_URI,
    node_env: process.env.NODE_ENV,
    email_sender: process.env.EMAIL_USER,
    email_pass: process.env.EMAIL_PASS,
}