import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { BookRoutes } from '../modules/book/book.route';


const router = express.Router();

const moduleRoutes = [
  {
    path: '/books',
    route: BookRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },

  
];

moduleRoutes.forEach(({ path, route }) => router.use(path, route));

export default router;
