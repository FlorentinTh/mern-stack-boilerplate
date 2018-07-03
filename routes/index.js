import { Router } from 'express';

import apiRoutes from './api';
import authController from '../controllers/authController';

const router = Router();

/* eslint no-unused-vars: 0 */
router.get('/', (req, res, next) => {
  res.render('index', { url: req.originalUrl });
});

router.get('/register', (req, res, next) => {
  res.render('index', { url: req.originalUrl });
});

router.post('/register', (req, res, next) => {
  authController.register(req, res, next);
});

router.get('/login', (req, res, next) => {
  res.render('index', { url: req.originalUrl });
});

router.post('/login', (req, res, next) => {
  authController.login(req, res, next);
});

router.use('/api', apiRoutes);

export default router;
