const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/jwtMiddleware')
const {
  getTopGames,
  getGame,
  saveGame,
  unsaveGame,
  getSavedGames,
} = require('../controllers/gameController')

router.route('/').post(getGame)
router.route('/top').get(getTopGames)
router.route('/:id').put(protect, saveGame)
router.route('/saved').get(protect, getSavedGames)
router.route('/saved/:id').put(protect, unsaveGame)

module.exports = router
