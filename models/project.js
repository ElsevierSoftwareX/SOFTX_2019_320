const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
  name: {type: String, unique: true },
  urlName: {type: String },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  channels: [],
  subProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubProject' }],
  created: {type: String }
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
