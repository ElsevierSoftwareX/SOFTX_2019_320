const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  user: String,
  body: {type: String},
  channelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel' },
  created_at: { type: Date, default: Date.now }
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
