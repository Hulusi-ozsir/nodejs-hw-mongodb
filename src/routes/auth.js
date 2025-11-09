import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { sendResetEmailController, resetPasswordController } from '../controllers/authController.js';
import { sendResetEmailSchema, resetPasswordSchema } from '../schemas/authSchemas.js';

const router = express.Router();

router.post('/send-reset-email', validateBody(sendResetEmailSchema), sendResetEmailController);
router.post('/reset-pwd', validateBody(resetPasswordSchema), resetPasswordController);

export default router;  // <-- default export eklendi