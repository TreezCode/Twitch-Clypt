const mongoose = require('mongoose')

const clipSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    id: {
      type: String,
      unique: true,
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
      index: true
    },
    creator_id: {
      type: String,
      required: true,
    },
    creator_name: {
      type: String,
      required: true,
    },
    video_id: {
      type: String,
    },
    game_id: {
      type: String,
    },
    language: {
      type: String,
    },
    title: {
      type: String,
    },
    view_count: {
      type: Number,
    },
    created_at: {
      type: String,
    },
    thumbnail_url: {
      type: String,
    },
    duration: {
      type: Number,
    },
    views: {
      type: Number,
      default: 1,
    },
    pagination: {
      cursor: {
        type: String,
      }
    },
  },
  {
    timestamps: true,
  }
  )
  
module.exports = mongoose.model('Clip', clipSchema)
