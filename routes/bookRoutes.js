import express from 'express'

const router = express.Router();

import {addBook, showBooks,showBookId,editBook,deleteBook} from '../controllers/bookController.js'

router.post('/',addBook);
router.delete ('/',showBooks);
router.get ('/',showBookId);
router.put ('/:id',editBook);
router.delete ('/:id',deleteBook);
export default router;
