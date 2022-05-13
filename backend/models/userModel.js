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
        image_url: { type: String }
      },
      {
        timestamps: true,
      }
    ],
    clips: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Clip' },
        name: { type: String, required: true },
      },
      {
        timestamps: true,
      }
    ],
    games: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
        name: { type: String, required: true },
      },
      {
        timestamps: true,
      }
    ],
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema)
