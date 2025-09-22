import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import logger from '../helpers/logger';
dotenv.config();
const {
  NODE_ENV,
  DB_HOST,
  DB_NAME,
  DB_TEST,
  DB_DIALECT,
  DB_PASSWORD,
  DB_USERNAME,
  DB_PROD_NAME,
  DB_PORT,
} = process.env;

let database = DB_NAME;

if (NODE_ENV == 'test') database = DB_TEST;
if (NODE_ENV == 'production') database = DB_PROD_NAME;

const sequelize = new Sequelize(
  `${DB_DIALECT}://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${database}`,
  { logging: (msg) => logger.info(msg) }
);
export default sequelize;
