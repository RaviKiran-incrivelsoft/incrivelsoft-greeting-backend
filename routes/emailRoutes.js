const express = require('express');
const { sendEmails } = require('../controllers/emailController');
const router = express.Router();

router.post('/sendemails', sendEmails);

module.exports = router;