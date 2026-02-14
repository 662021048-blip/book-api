import express from 'express'

const router = express.Router();

import {addBook, showBooks,showBookId,editBook,deleteBook} from '../controllers/bookController.js'
import authenticateToken from '../middlewares/auth.js';

router.post('/',authenticateToken,addBook);
router.post('/',authenticateToken,addBook);
router.delete('/:id',authenticateToken,deleteBook);
router.get('/',authenticateToken,showBooks);
router.put('/:id',authenticateToken,editBook);
router.get('/:id',authenticateToken,showBookId);
export default router;