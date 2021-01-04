const express = require('express')
const router = express.Router()

const {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    forgotPassword,
    resetPassword,
    updateDetails,
    updatePassword
} = require('../controllers/auth')

const {
    protect
} = require('../middleware/auth')
const { route } = require('./courses')


router.post('/register', registerUser)

router.post('/login', loginUser)

router.get('/logout', logoutUser)

router.get('/me', protect, getCurrentUser)

router.post('/forgotpassword', forgotPassword)

router.put('/resetpassword/:resettoken', resetPassword)

router.put('/updatedetails', protect, updateDetails)

router.put('/updatepassword', protect, updatePassword)


module.exports = router;