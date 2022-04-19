const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/jwtMiddleware')
const { getTopGames } = require('../controllers/gameController')

router.route('/').get(getTopGames)

module.exports = router
