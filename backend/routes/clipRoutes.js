const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/jwtMiddleware')
const {
  getClips,
  getSavedClips,
  saveClip,
  unsaveClip,
} = require('../controllers/clipController')

router.route('/').post(getClips)
router.route('/:id').put(protect, saveClip)
router.route('/saved').put(protect, getSavedClips)
router.route('/saved/:id').put(protect, unsaveClip)

module.exports = router
