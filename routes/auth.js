const express = require('express')
const router = express.Router()

const {
    registerUser,
    loginUser,
    getCurrentUser,
    forgotPassword
} = require('../controllers/auth')

const {
    protect
} = require('../middleware/auth')


router.post('/register', registerUser)

router.post('/login', loginUser)

router.get('/me', protect, getCurrentUser)

router.post('/forgotpassword', forgotPassword)


module.exports = router;