const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/twitchMiddleware')
const { fetchTwitchByName, fetchTwitchById, saveTwitch } = require('../controllers/twitchController')

router.route('/').get(fetchTwitchByName).post(saveTwitch)
router.route('/id').get(fetchTwitchById)

module.exports = router
