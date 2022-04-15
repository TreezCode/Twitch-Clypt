const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/jwtMiddleware')
const { saveTwitch, getTwitch } = require('../controllers/twitchController')

router.route('/').get(getTwitch)
router.route('/:id').put(protect, saveTwitch)

module.exports = router
