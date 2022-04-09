const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/twitchMiddleware')
const { getTopGames } = require('../controllers/gamesController')

router.route('/').get(getTopGames)

module.exports = router
