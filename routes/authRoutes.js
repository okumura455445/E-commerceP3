const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', verifyToken, authController.logout);
router.post('/auth0', authController.auth0Login);
router.get('/profile', verifyToken, authController.profile);

// Rutas sociales
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login?error=auth_failed' }), authController.googleCallback);
} else {
  router.get('/google', (req, res) => res.status(501).json({ success: false, message: 'Google OAuth no está configurado.' }));
  router.get('/google/callback', (req, res) => res.status(501).json({ success: false, message: 'Google OAuth no está configurado.' }));
}

if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
  router.get('/facebook/callback', passport.authenticate('facebook', { session: false, failureRedirect: '/login?error=auth_failed' }), authController.facebookCallback);
} else {
  router.get('/facebook', (req, res) => res.status(501).json({ success: false, message: 'Facebook OAuth no está configurado.' }));
  router.get('/facebook/callback', (req, res) => res.status(501).json({ success: false, message: 'Facebook OAuth no está configurado.' }));
}
router.get('/apple', authController.appleCallback);

module.exports = router;