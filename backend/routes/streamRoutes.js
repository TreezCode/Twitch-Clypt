const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/twitchMiddleware')
const { fetchTopStreams } = require('../controllers/streamController')

router.route('/').get(fetchTopStreams)

module.exports = router
