const mongoose = require("mongoose");

const subProjectSchema = mongoose.Schema({
  name: {type: String },
  urlName: {type: String },
  projectId: {type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  supervisor: {type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  teamLeaders: [{type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const SubProject = mongoose.model("SubProject", subProjectSchema);

module.exports = SubProject;
