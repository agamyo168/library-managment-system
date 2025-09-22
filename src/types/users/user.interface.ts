export interface UserParams {
  password: string;
  name: string;
  email: string;
}
export interface LoginParams {
  password: string;
  email: string;
}
// export default interface User extends Model {
//   id: number;
//   username: string;
//   password: string;
//   role: 'admin' | 'user';
//   compare(password: string): Promise<boolean>;
//   signToken(): string;
// }
