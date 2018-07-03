import { Router } from 'express';
import expressJWT from 'express-jwt';
import dotenv from 'dotenv';

import exampleRoutes from './exampleRoutes';

const router = Router();
dotenv.config();

const auth = expressJWT({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload',
});

router.use('/example', auth, exampleRoutes);

export default router;
