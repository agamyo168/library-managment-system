import Joi, { ObjectSchema } from 'joi';

const signInSchema: ObjectSchema = Joi.object({
  email: Joi.string().email().min(6).required(),
  password: Joi.string().min(8).required(),
});
const userSchema: ObjectSchema = Joi.object({
  name: Joi.string().min(6).required(),
  email: Joi.string().email().min(6).required(),
  password: Joi.string().min(8).required(),
});
const updateSchema: ObjectSchema = Joi.object({
  name: Joi.string().min(6).required(),
  email: Joi.string().email().min(6).required(),
});
interface UserDto {
  password: string;
  name: string;
  email: string;
}
interface UpdateUserDto {
  password: string;
  name: string;
  email: string;
}
interface LoginDto {
  password: string;
  email: string;
}
interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export {
  userSchema,
  updateSchema,
  signInSchema,
  UserDto,
  UpdateUserDto,
  ChangePasswordDto,
  LoginDto,
};
