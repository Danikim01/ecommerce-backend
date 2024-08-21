import * as dotenv from 'dotenv';

dotenv.config();

export default {
    port: process.env.PORT,
    mongoUri: process.env.MONGO_URI,
    node_env: process.env.NODE_ENV,
    email_sender: process.env.EMAIL_USER,
    email_pass: process.env.EMAIL_PASS,
    passport_key: process.env.PASSPORT_KEY,
    email_key: process.env.EMAIL_KEY,
    base_url: process.env.BASE_URL,
    user_timeout: process.env.USERS_TIMEOUT,
    stripe_key: process.env.STRIPE_KEY,
    mercadopago_key: process.env.MERCADOPAGO_KEY,
}