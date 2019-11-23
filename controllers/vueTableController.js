const User = require("../models/user");
const Project = require("../models/project");
const Channel = require("../models/channel");
const SubProject = require("../models/subProject");

exports.getAdminUsers = (req, res, next) => {
  User.find({role: 'user'}).then(users => {
    res.status(200).json({ users });
  })
  .catch(err => {
    const error = new Error(err);
    return next(error);
  });
};

exports.getAdminProjectUsers = (req, res, next) => {
  Promise.all([
    Project.findById(req.params.projectId).populate('users'),
    User.find({role: 'user'})
  ])
  .then(results => {
    const [projectUsers, systemUsers] = results;
    res.status(200).json({users: projectUsers.users, systemUsers });
  })
  .catch(err => {
    const error = new Error(err);
    return next(error);
  });
};

exports.getAdminSubProjects = (req, res, next) => {
  Promise.all([
    SubProject.find({projectId:req.params.projectId })
    .populate('supervisor')
    .populate('teamLeaders')
    .populate('users'),
    Project.findById(req.params.projectId).populate('users')
  ])
  .then(result => {
    const [subProjects, projectUsers] = result;
    res.status(200).json({subProjects, projectUsers: projectUsers.users});
  })
  .catch(err => {
    const error = new Error(err);
    return next(error);
  });
};

exports.getAdminChannelLinks = (req, res, next) => {
  const projectId = req.params.projectId;
  Promise.all([
    Channel.find({projectId: projectId}),
    Project.findById(projectId)
  ])
  
  .then(result => {
    const [channels, project] = result;
    return res.status(200).json({
      channels, 
      project, 
    });
  })
  .catch(err => {
    logger.error(err.stack);
    const error = new Error(err);
    return next(error);
  });
};
