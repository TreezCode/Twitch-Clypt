const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    twitches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Twitch',
      },
    ],
    clips: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clip',
      },
    ],
    games: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
      },
    ],
    streams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stream',
      },
    ],
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema)
