const express = require('express');
const router = express.Router();
const { validateBody } = require('../middlewares/validateBody');
const { sendResetEmailController, resetPasswordController } = require('../controllers/authController');
const { sendResetEmailSchema, resetPasswordSchema } = require('../schemas/authSchemas');

router.post('/send-reset-email', validateBody(sendResetEmailSchema), sendResetEmailController);
router.post('/reset-pwd', validateBody(resetPasswordSchema), resetPasswordController);

module.exports = router;