const asyncHandler = require('express-async-handler')

// @desc    Get clips
// @route   GET /api/clips
// @access  Private
const getClips = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Get clips' })
})

// @desc    Save clip
// @route   POST /api/clips
// @access  Private
const saveClip = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400)
    throw new Error('Please add a clip')
  }
  res.status(200).json({ message: 'Saved clip' })
})

// @desc    Update clip
// @route   PUT /api/clips/:id
// @access  Private
const updateClip = asyncHandler(async (req, res) => {
  res.status(200).json({ message: `Update clip ${req.params.id}` })
})

// @desc    Delete clip
// @route   DELETE /api/clips/:id
// @access  Private
const deleteClip = asyncHandler(async (req, res) => {
  res.status(200).json({ message: `Delete clip ${req.params.id}` })
})

module.exports = {
  getClips,
  saveClip,
  updateClip,
  deleteClip,
}
