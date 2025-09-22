import jwt from 'jsonwebtoken';

import { UserParams } from '../types/users/user.interface';
import dotenv from 'dotenv';
import { prisma } from '../server';

dotenv.config();

const { JWT_SECRET: JWT, JWT_EXPIRE: EXPIRE } = process.env;

const isValidEmail = async (email: string): Promise<boolean> => {
  const user = await prisma.user.findFirst({ where: { email } });
  return user == null;
};
const createUser = async (userParams: UserParams): Promise<User> => {
  const isValid = await isValidEmail(userParams.email);
  if (!isValid) {
    throw new Error('email already exists'); //catch the error in the auth controller
  }
  const user = (await Users.create({ ...userParams })) as User;
  return user;
};
const generateToken = (id: number, role: string) => {
  return jwt.sign({ id, role }, `${JWT}`, {
    expiresIn: `${EXPIRE}`,
  });
};

const authenticate = async (userParams: UserParams) => {
  const user = (await Users.findOne({
    where: { username: userParams.username },
  })) as User;
  const isAuthenticated = user.compare(userParams.password); //false
  if (!isAuthenticated) {
    throw new Error('invalid username or password'); //catch the error in the auth controller
  }
  const token = generateToken(user.id, user.role);
  return token;
};

export { createUser, authenticate };
