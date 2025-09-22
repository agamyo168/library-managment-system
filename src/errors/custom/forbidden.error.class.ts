import { StatusCodes } from 'http-status-codes';
import CustomError from './custom.error.class';

class ForbiddenError extends CustomError {
  constructor(message: string) {
    super(message, StatusCodes.FORBIDDEN);
  }
}
export default ForbiddenError;
