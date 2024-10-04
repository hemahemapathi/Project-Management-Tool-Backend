import express from 'express';
import { uploadFile, getFile } from '../controllers/file.js';

const router = express.Router();

router.post('/upload', uploadFile);
router.get('/:id', getFile);

export default router;
