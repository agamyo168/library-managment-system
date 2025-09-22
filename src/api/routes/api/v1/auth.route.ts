import express from 'express';
import { login, signup } from '../../../controllers/auth.controller';

const router = express.Router();

router.route('/signup').post(signup);
router.route('/login').post(login);
//logout

export default router;
