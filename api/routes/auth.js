const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validator = require('../middlewares/validator');
const { signupSchema, loginSchema } = require('../validations/authSchema');

router.post('/signup',validator(signupSchema), authController.signup);
router.post('/login',validator(loginSchema), authController.login);
router.post('/refresh-token', authController.refreshToken);

module.exports = router;
