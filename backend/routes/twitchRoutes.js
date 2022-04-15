const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/jwtMiddleware')
const { getTwitch, saveTwitch, getSavedTwitch, deleteTwitch } = require('../controllers/twitchController')

router.route('/').post(getTwitch)
router.route('/saved').get(protect, getSavedTwitch)
router.route('/:id').put(protect, saveTwitch).delete(protect, deleteTwitch)

module.exports = router
