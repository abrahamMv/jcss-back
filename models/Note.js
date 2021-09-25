const mongoose = require("mongoose");

const NoteShema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  note: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Note", NoteShema);
