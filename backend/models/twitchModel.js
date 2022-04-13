const mongoose = require('mongoose')

const twitchSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'User',
    },
    id: {
      type: String,
      required: true,
      unique: [true]
    },
    login: {
      type: String,
      required: true,
    },
    display_name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
    },
    broadcaster_type: {
      type: String,
    },
    description: {
      type: String,
    },
    profile_image_url: {
      type: String,
    },
    offline_image_url: {
      type: String,
    },
    view_count: {
      type: Number,
    },
    created_at: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Twitch', twitchSchema)
