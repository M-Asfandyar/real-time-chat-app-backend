const express = require('express');
const { registerUser, loginUser, updateUserStatus, getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/status', updateUserStatus);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

module.exports = router;
