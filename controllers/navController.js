const Project = require("../models/project");
const Channel = require("../models/channel");
const Message = require("../models/message");
const winston = require('../conf/winston');
const logger = winston.logger;

exports.getPanelIndex = (req, res, next) => {
  if (req.user.role === 'admin') {
    Project.find()
    .then(projects => {
      res.render("adminProjects", {projects});
    })
    .catch(err => {
      logger.error(err.stack);
      res.render('500');
    });
  } else {
    Project.find({users: req.user._id})
    .then(projects => {
      res.render("projects", {projects});
    })
    .catch(err => {
      logger.error(err.stack);
      res.render('500');
    });
  }
};

exports.getProject = (req, res, next) => {
  Project.findOne({urlName: req.params.urlName})
  .then(project => {
    if (!project) {
      req.flash("error", "This Project does not exist.");
      return res.redirect('/');
    }
    res.render("adminProject", {project});
  })
  .catch(err => {
    logger.error(err.stack);
    res.render('500');
  });
};

exports.getSubProjects = (req, res, next) => {
  Project.findOne({urlName: req.params.urlName})
  .then(project => {
    if (!project) {
      req.flash("error", "This Project does not exist.");
      return res.redirect('/');
    }
    res.render("adminSubProjects", {project});
  })
  .catch(err => {
    logger.error(err.stack);
    res.render('500');
  });
};

exports.getChannels = (req, res, next) => {
  const projectId = req.params.projectId;
  Promise.all([
    Channel.find({projectId: projectId}),
    Project.findById(projectId)
  ])
  
  .then(result => {
    const [channels, project] = result;
    res.render("adminChannels", {channels: JSON.stringify(channels), project});
  })
  .catch(err => {
    logger.error(err.stack);
    res.render('500');
  });
};

exports.getChannelsLinks = (req, res, next) => {
  const projectId = req.params.projectId;
  Promise.all([
    Channel.find({projectId: projectId}),
    Project.findById(projectId)
  ])
  
  .then(result => {
    const [channels, project] = result;
    res.render("adminChannelsLinks", {project});
  })
  .catch(err => {
    logger.error(err.stack);
    res.render('500');
  });
};

exports.getUserProject = (req, res, next) => {
  Project.findOne({urlName: req.params.urlName})
  .then(project => {
    if (!project) {
      req.flash("error", "This Project does not exist.");
      return res.redirect('/');
    }
    return Promise.all([
      project, Channel.find({projectId: project._id})
    ]);
  })
  .then(result => {
    const [project, channels] = result;
    res.render("project", {project, channels});
  })
  .catch(err => {
    logger.error(err.stack);
    res.render('500');
  });
};

exports.getChatC2 = (req, res, next) => {
  Promise.all([
    Project.findById(req.params.projectId),
    Channel.findOne({projectId: req.params.projectId, name: "C2"})
  ])
  .then(result => {
    const [project, channel] = result;
    if (!project) {
      req.flash("error", "This Project does not exist.");
      return res.redirect('/');
    }
    return Promise.all([
      Channel.find({projectId: project._id}),
      Message.find({channelId: channel._id}),
      project, channel
    ]);
  })
  .then(result => {
    const [channels, messages, project, channel] = result;
    res.render("chatPageForC6", {channels, project, channel, messages: JSON.stringify(messages)});
  })
  .catch(err => {
    logger.error(err.stack);
    res.render('500');
  });
};

exports.getChatPage = (req, res, next) => {
  Promise.all([
    Project.findOne({urlName: req.params.projectUrl}),
    Channel.findOne({urlName: req.params.channelUrl})
  ])
  .then(result => {
    const [project, channel] = result;
    if (!project) {
      req.flash("error", "This Project does not exist.");
      return res.redirect('/');
    }
    return Promise.all([
      Channel.find({projectId: project._id}),
      Message.find({channelId: channel._id}),
      project, channel
    ]);
  })
  .then(result => {
    const [channels, messages, project, channel] = result;
    if (["C1", "C4"].includes(channel.name)) {
      res.render("chatPageLinks", {channels, project, channel, messages: JSON.stringify(messages)});
    } else {
      res.render("chatPage", {channels, project, channel, messages: JSON.stringify(messages)});
    }
  })
  .catch(err => {
    logger.error(err.stack);
    res.render('500');
  });
};

exports.error500 = (req, res, next) => {
    res.status(500).render("500");
};

