const express = require('express')
const router = express.Router()
const {
  fetchUserClips,
  fetchGameClips,
  saveClip,
  updateClip,
  deleteClip,
} = require('../controllers/clipController')

router.route('/game').get(fetchGameClips)
router.route('/').get(fetchUserClips).post(saveClip)
router.route('/').delete(deleteClip).put(updateClip)

module.exports = router
