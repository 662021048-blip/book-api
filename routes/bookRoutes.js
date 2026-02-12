import express from 'express'

const router = express.Router();

import {addBook} from '../controllers/bookController.js'

router.post('/',addBook);

export default router;
