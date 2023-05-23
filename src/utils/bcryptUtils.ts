import bcrypt from 'bcrypt';

const saltRounds = 10;
const encryptPassword = async (password: string) =>
    await bcrypt.hash(password, saltRounds);


const validatePassword = async (password: string, hashedPassword: string) =>
    await bcrypt.compare(password, hashedPassword);

export {encryptPassword, validatePassword}
