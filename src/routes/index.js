import express from 'express';

const router = express.Router();

import { createBingo, getNumber, generateCard, checkWinner } from '../controllers/index';

router.post('/create-bingo', createBingo);
router.get('/get-number/:id', getNumber);
router.post('/generate-card/:id', generateCard);
router.post('/check-winner/:id', checkWinner);

export default router;
