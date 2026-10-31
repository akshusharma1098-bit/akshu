const express = require('express');
const router = express.Router();
const { rawStore } = require('../config/firebase');

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required.' });
  }

  // Check demo accounts or create dynamic session
  const uid = 'usr_' + Date.now();
  const user = {
    uid,
    email,
    displayName: email.split('@')[0],
    role: email.includes('admin') ? 'admin' : 'user',
    token: 'jwt_demo_token_' + uid
  };

  rawStore.users[uid] = user;

  res.json({
    success: true,
    user
  });
});

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { email, password, fullName, preferredMode } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required.' });
  }

  const uid = 'usr_' + Date.now();
  const user = {
    uid,
    email,
    displayName: fullName || email.split('@')[0],
    preferredMode: preferredMode || 'bus',
    role: 'user',
    token: 'jwt_demo_token_' + uid
  };

  rawStore.users[uid] = user;

  res.status(201).json({
    success: true,
    user
  });
});

// GET /api/auth/guest
router.get('/guest', (req, res) => {
  const guestUser = {
    uid: 'guest_' + Date.now(),
    displayName: 'Guest Commuter (Demo)',
    email: 'guest.rider@kota.demo',
    role: 'user',
    isGuest: true
  };

  res.json({
    success: true,
    user: guestUser
  });
});

module.exports = router;

