import { Router } from 'express';
import { upload } from '../middleware/upload.js';
import { createCustomInquiry, createContactInquiry } from '../controllers/inquiryController.js';

const router = Router();

// Public endpoints
router.post('/custom', upload.single('file'), createCustomInquiry);
router.post('/contact', upload.none(), createContactInquiry);

export default router;
