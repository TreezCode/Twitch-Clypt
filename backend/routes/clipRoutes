const express = require('express')
const router = express.Router()
const {
  getClips,
  saveClip,
  updateClip,
  deleteClip,
} = require('../controllers/clipController')

router.route('/').get(getClips).post(saveClip)
router.route('/').delete(deleteClip).put(updateClip)

module.exports = router
