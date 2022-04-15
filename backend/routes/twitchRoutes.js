const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/jwtMiddleware')
const { saveTwitch, getTwitch, deleteTwitch } = require('../controllers/twitchController')

router.route('/').get(getTwitch)
router.route('/:id').put(protect, saveTwitch).delete(protect, deleteTwitch)
router.route('/twitches/:id').put(protect, deleteTwitch)

module.exports = router
