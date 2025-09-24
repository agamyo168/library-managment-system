import Joi from 'joi';
const checkoutBookIdSchema = Joi.object({
  bookId: Joi.number().integer().min(1).required(),
});
interface CheckoutParam {
  bookId: number;
  borrowerId: number;
}
export { CheckoutParam, checkoutBookIdSchema };
