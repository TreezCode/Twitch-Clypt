const mongoose = require('mongoose')

const streamSchema = mongoose.Schema(
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
    user_id: {
      type: String,
      required: true,
    },
    user_login: {
      type: String,
      required: true,
    },
    user_name: {
      type: String,
      required: true,
    },
    game_id: {
      type: String,
      required: true,
    },
    game_name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    viewer_count: {
      type: Number,
      required: true,
    },
    started_at: {
      type: String,
      required: true,
    },
    language: {
      type: String,
    },
    thumbnail_url: {
      type: String,
    },
    tag_ids: {
      type: String,
      required: true,
    },
    is_mature: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Stream', streamSchema)
