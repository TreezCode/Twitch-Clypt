const mongoose = require('mongoose')

const twitchSchema = mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    id: {
      type: String,
      unique: true,
      required: true,
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
    views: {
      type: Number,
      default: 0,
    },
    followers: {
      total: {
        type: Number,
      },
      data: [
        {
          from_id: { type: String },
          from_login: { type: String },
          from_name: { type: String },
          to_id: { type: String },
          to_login: { type: String },
          to_name: { type: String },
          followed_at: { type: String },
        },
      ],
      pagination: {
        cursor: { type: String },
      },
    },
    clips: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Clip' },
        name: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Twitch', twitchSchema)
