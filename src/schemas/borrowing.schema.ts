import Joi from 'joi';
const checkoutBookIdSchema = Joi.object({
  bookId: Joi.number().integer().min(1).required(),
});
const borrowingSchema = Joi.object({
  bookId: Joi.number().integer().min(1).required(),
});
interface CheckoutParam {
  bookId: number;
  borrowerId: number;
}

interface BorrowingDto {
  bookId: number;
}

export { CheckoutParam, BorrowingDto, checkoutBookIdSchema, borrowingSchema };
