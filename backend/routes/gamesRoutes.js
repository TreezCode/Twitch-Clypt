const express = require('express')
const router = express.Router()
const { protect, fetchToken } = require('../middleware/authMiddleware')
const { getTopGames } = require('../controllers/gamesController')

router.route('/').get(fetchToken, getTopGames)

module.exports = router
