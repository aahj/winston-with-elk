const express = require('express');
const AuthService = require('../../services/AuthService');

const router = express.Router();

router.post('/login', async (req, res) => {
  const authService = new AuthService();
  const { status, ...response } = await authService.login(req);
  res.status(status).json(response);
});
module.exports = router;
