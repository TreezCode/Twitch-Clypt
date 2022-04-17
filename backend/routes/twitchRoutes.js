const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/jwtMiddleware')
const {
  getTwitch,
  saveTwitch,
  getSavedTwitch,
  unsaveTwitch,
} = require('../controllers/twitchController')

router.route('/').post(getTwitch)
router.route('/:id').put(protect, saveTwitch)
router.route('/saved').get(protect, getSavedTwitch)
router.route('/saved/:id').put(protect, unsaveTwitch)

module.exports = router
