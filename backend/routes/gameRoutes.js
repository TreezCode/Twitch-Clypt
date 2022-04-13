const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/twitchMiddleware')
const {
  fetchTopGames,
  fetchGameByName,
  fetchGameById,
} = require('../controllers/gameController')

router.route('/').get(fetchTopGames)
router.route('/id').get(fetchGameById)
router.route('/name').get(fetchGameByName)

module.exports = router
