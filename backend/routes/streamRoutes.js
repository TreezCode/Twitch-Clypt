const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/twitchMiddleware')
const { getTopStreams } = require('../controllers/streamController')

router.route('/').get(getTopStreams)

module.exports = router
