import dotenv from 'dotenv';
dotenv.config();
const {
  PORT,
  HOST,
  JWT_SECRET: JWT,
  JWT_EXPIRE: EXPIRE,
  BCRYPT_SALT_ROUNDS: SALT,
  BCRYPT_SECRET_PEPPER: PEPPER,
} = process.env;

export { JWT, EXPIRE, SALT, PEPPER, PORT, HOST };
