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
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Twitch' },
        name: { type: String, required: true },
      },
    ],
    clips: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Clip' },
        name: { type: String, required: true },
      },
    ],
    games: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
        name: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema)
