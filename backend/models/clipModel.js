const mongoose = require('mongoose')

const clipSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    embed_url: {
      type: String,
      required: true,
    },
    broadcaster_id: {
      type: String,
      required: true,
    },
    broadcaster_name: {
      type: String,
      required: true,
    },
    creator_id: {
      type: String,
      required: true,
    },
    creator_name: {
      type: String,
      required: true,
    },
    game_id: {
      type: String,
      required: true,
    },
    video_id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
    view_count: {
      type: Number,
      required: true,
    },
    created_at: {
      type: String,
      required: true,
    },
    thumbnail_url: {
      type: String,
    },
    duration: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Clip', clipSchema)
