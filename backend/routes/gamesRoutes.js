const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/twitchMiddleware')
const {
  getTopGames,
  getGameByName,
  getGameById,
} = require('../controllers/gameController')

router.route('/').get(getTopGames)
router.route('/id').get(getGameById)
router.route('/name').get(getGameByName)

module.exports = router
