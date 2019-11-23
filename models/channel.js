const mongoose = require("mongoose");

const channelSchema = mongoose.Schema({
  name: {type: String },
  urlName: {type: String },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubProject' },
  permitStatus: [{type: String}],
  links: [{
    name: String,
    url: String
  }]
});

const Channel = mongoose.model("Channel", channelSchema);

module.exports = Channel;
