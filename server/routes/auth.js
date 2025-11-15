const express = require('express');
const router = express.Router();
const { User } = require('../database');
const jwt = require('jsonwebtoken');
const { isValidToken } = require('../utils/token');

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, type } = req.body;  // TREBUIE să includă type
  try {
    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    if (!type) {
      return res.status(400).json({ success: false, message: 'User type required' });
    }

    const user = await User.create({ name, email, password, type });
    const { password: _, ...safeUser } = user.toJSON();

    const token = jwt.sign(
      { id: user.id, role: user.type },
      process.env.TOKEN_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { token, user: safeUser }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error registering user' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    const validPassword = await user.validatePassword(password);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

   const { password: _, ...safeUser } = user.toJSON();
   const token = jwt.sign(
      { id: user.id, role: user.type },
      process.env.TOKEN_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { token, user: safeUser }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error during login', error: err.message });
  }
});


router.post('/check', async (req, res) => {
    const token = req.body.token;

    if (!token) {
        return res.status(400).json({success: false, message: 'Token not found', data: {}})
    }

    const validToken = isValidToken(token);

    if (!validToken) {
        return res.status(400).json({success: false, message: 'Token not valid', data: {}})
    }
    res.status(200).json({success: true, message: 'Token is valid', data:{} })

})
module.exports = router;
