import { Router } from 'express';

const router = Router();

import { createTables } from '../controllers/migration';

router.post('/create-tables', createTables);

export default router;