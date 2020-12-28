const express = require('express')
const router = express.Router()

const {
    registerUser,
    loginUser,
    currentUser
} = require('../controllers/auth')

const {
    protect
} = require('../middleware/auth')


router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, currentUser)

module.exports = router;