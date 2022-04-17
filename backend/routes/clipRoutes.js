const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/jwtMiddleware')
const {
  getTwitchClips,
  getGameClips,
  getSavedClips,
  saveClip,
  unsaveClip,
} = require('../controllers/clipController')

router.route('/').post(getTwitchClips)
router.route('/:id').put(protect, saveClip)
router.route('/game').post(getGameClips)
router.route('/saved').put(protect, getSavedClips)
router.route('/saved/:id').put(protect, unsaveClip)

module.exports = router
