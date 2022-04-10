const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/twitchMiddleware')
const { findByLogin, findById } = require('../controllers/twitchUserController')

router.route('/').get(findByLogin)
router.route('/id').get(findById)

module.exports = router
