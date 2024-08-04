import bcrypt from 'bcrypt';
import moment from 'moment';

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
}

export const generateRandomStringCode = () => {
    return Math.random().toString(36).substring(7);
}

export const generateTimeStamp = () => {
    return moment().format('YYYY-MM-DD HH:mm:ss');
}