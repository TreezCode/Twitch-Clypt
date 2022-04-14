const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/jwtMiddleware')
const { fetchTopStreams } = require('../controllers/streamController')

router.route('/').get(fetchTopStreams)

module.exports = router
