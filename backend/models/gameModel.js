const mongoose = require('mongoose')

const gameSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    box_art_url: {
      type: {},
    },
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Game', gameSchema)
