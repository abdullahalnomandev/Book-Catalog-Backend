import express from 'express';
import { BookController } from './book.controller';

const router = express.Router();


router.get('/',BookController.getAllBook);
router.post('/',BookController.createBook);
router.delete('/:id',BookController.deleteBook);
router.get('/:id',BookController.getSingleBook);
router.patch('/:id',BookController.updateBook);
router.post('/add-review/:bookId',BookController.addReview);

export const BookRoutes = router;
