import * as dotenv from 'dotenv';

dotenv.config();

export default {
    port: process.env.PORT,
    mongoUri: process.env.MONGO_URI,
}