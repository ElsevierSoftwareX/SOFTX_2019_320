const User = require("../models/user");
const Project = require("../models/project");
const Channel = require("../models/channel");
const SubProject = require("../models/subProject");
const winston = require('../conf/winston');
const logger = winston.logger;

const convertToUrlName = (name) => {
    return name.toLowerCase().trim().replace(/[^\w ]+/g,'').replace(/ +/g,'_');
};

const initializeProjectChannels = (projectId, projectUrl) => {
    const projectChannels =[
        { name: 'C1', urlName: `${projectUrl}_c1`, projectId: projectId, permitStatus: ["S1"] },
        { name: 'C2', urlName: `${projectUrl}_c2`, projectId: projectId, permitStatus: ["S1"] },
        { name: 'C3', urlName: `${projectUrl}_c3`, projectId: projectId, permitStatus: ["S1", "S3"] },
        { name: 'C4', urlName: `${projectUrl}_c4`, projectId: projectId, permitStatus: ["S1", "S3"] },
        { name: 'C5', urlName: `${projectUrl}_c5`, projectId: projectId, permitStatus: ["S2"] },
        { name: 'C6', urlName: `${projectUrl}_c6`, projectId: projectId, permitStatus: ["S3"] },
        { name: 'Algedonic', urlName: `${projectUrl}_c7`, projectId: projectId, permitStatus: ["S1", "S5"] }
    ];
    return projectChannels;
};


exports.postCreateProject = (req, res) => {
    Project.findOne({name: req.body.name})
    .then(result => {
        if (result) {
            req.flash("error", "This Project name already exists.");
            return res.redirect('/');
        } 
        const newProject = new Project({
            name: req.body.name,
            urlName: convertToUrlName(req.body.name),
            created: new Date().toLocaleDateString('el-GR')
        });
        const projectChannels = initializeProjectChannels(newProject._id, newProject.urlName);
        return Promise.all([
            Channel.insertMany(projectChannels),
            newProject.save()
        ]);
    })
    .then(result => {
        return res.redirect('/');
    })
    .catch(err => {
        logger.error(err.stack);
        res.render('500');
    });
};

exports.putEditProject = (req, res) => {

};

exports.deleteProject = (req, res) => {
    const projectId = req.params.id;
    Project.findByIdAndRemove(projectId)
    .then(removedProject => {
        return Promise.all([
            // delete projectId from users.
            User.updateMany({ [`projects.${projectId}`]: { $type: 3 } }, {$unset: { [`projects.${projectId}`]: ""},  $inc: { projectsNo: -1 }}),
            // delete subprojects of this project.
            SubProject.deleteMany({projectId: projectId}),
            // delete channels of this project.
            Channel.deleteMany({projectId: projectId})
        ]);
    })
    .then(result => {
        res.status(204).json({
            message: "Project deleted."
        }); 
    })
    .catch(err => {
        logger.error(err.stack);
        res.status(500).json({
            message: "A problem occurred. Please try again later."
        }); 
    });
};

exports.postCreateSubProject = (req, res) => {
    const projectId = req.body.projectId;
    Project.findById(projectId)
    .then(project => {
        const newSubProject = new SubProject({
            name: req.body.name,
            urlName: convertToUrlName(req.body.name),
            projectId: projectId
        });
        project.subProjects.push(newSubProject._id);
        return Promise.all([
            project.save(),
            newSubProject.save()
        ]);
    })
    .then(result => {
        const [project, subProject] = result;
        return res.redirect(`/admin/project/${project.urlName}/subprojects`);
    })
    .catch(err => {
        logger.error(err.stack);
        res.render('500');
    });
};

exports.putEditSubProject = (req, res) => {
    SubProject.findById(req.params.id)
    .then(subProject => {
        subProject.supervisor = req.body.supervisor;
        subProject.teamLeaders = req.body.teamLeaders;
        subProject.users = req.body.users;
        return subProject.save();
    })
    .then(result => {
        logger.info("Subproject updated");
        return res.status(200).json({subProject: result, message: "Subproject updated."});
    })
    .catch(err => {
        logger.error(err.stack);
        res.status(500).json({
            message: "A problem occurred. Please try again later."
        });
    });
};

exports.deleteSubProject = (req, res) => {
    const projectId = req.params.id;
    SubProject.findOneAndDelete({_id: projectId})
    .then(deletedSubProject => {
        return Project.update({_id: deletedSubProject.projectId}, { $pull: { subProjects :  projectId } } );
    })
    .then(result => {
        res.status(204).json({
            message: "Subproject deleted."
        }); 
    })
    .catch(err => {
        logger.error(err.stack);
        res.status(500).json({
            message: "A problem occurred. Please try again later."
        }); 
    });
};

exports.postCreateUser = (req, res) => {
    User.findOne({email: req.body.email})
    .then(result => {
        if (result) {
            return res.status(402).json({
                message: 'This User already exists.'
            });
        } 
        const newUser = new User(req.body);
        return newUser.save();
    })
    .then(user => {
        logger.info(`New user created with email ${user.email}`);
        return User.find({role: 'user'});
    })
    .then(users => {
        return res.status(201).json({users});
    })
    .catch(err => {
        logger.error(err.stack);
        res.render('500');
    });
};

exports.putEditUser = (req, res) => {
    User.findById({_id: req.params.id})
    .then(user => {
        user.email = req.body.email;
        user.fullname = req.body.fullname;
        return user.save();
    })
    .then(result => {
        logger.info(`User with email ${result.email} updated.`);
        res.status(200).json({user: result});
    })
    .catch(err => {
        logger.error(err.stack);
        res.status(500).json({
            message: "A problem occurred. Please try again later."
        }); 
    });
};

exports.deleteUser = (req, res) => {
    User.findByIdAndRemove(req.params.id)
    .then(result => {
        logger.info(`User with email ${result.email} deleted.`);
        res.status(204).json({
            message: "User deleted."
        }); 
    })
    .catch(err => {
        logger.error(err.stack);
        res.status(500).json({
            message: "A problem occurred. Please try again later."
        }); 
    });
};

exports.postCreateChannel = (req, res) => {
    Project.findById(req.body.projectId)
    .then(project => {
        const newChannel = new Channel(req.body);
        newChannel.urlName = project.urlName + "_" + req.body.name;
        return newChannel.save();
    })
    .then(channel => {
        logger.info("channel created");
        res.status(201).json({
            channel,
            message: "Channel created."
        }); 
    })
    .catch(err => {
        logger.error(err.stack);
        res.status(500).json({
            message: "A problem occurred. Please try again later."
        }); 
    });
};

exports.putUpdateChannel = (req, res) => {
    Channel.findById(req.params.channelId)
    .then(channel => {
        channel.permitStatus = [];
        channel.permitStatus = req.body.permitStatus;
        return channel.save();
    })
    .then(result => {
        logger.info("channel permitions updated");
        res.status(200).json({
            message: "Channel updated."
        }); 
    })
    .catch(err => {
        logger.error(err.stack);
        res.status(500).json({
            message: "A problem occurred. Please try again later."
        }); 
    });
};

exports.postChannelLinks = (req, res) => {
    Channel.findById(req.body.channelId)
    .then(channel => {
        const link = {
            name: req.body.name,
            url: req.body.url
        }
        channel.links.push(link);
        return channel.save();
    })
    .then(result => {
        logger.info("channel link added");
        return res.redirect(`/admin/project/${result.projectId}/channel-links`);
    })
    .catch(err => {
        logger.error(err.stack);
        res.status(500).json({
            message: "A problem occurred. Please try again later."
        }); 
    });
};

exports.putUpdateChannelLiks = (req, res) => {
    Channel.findById(req.params.channelId)
    .then(channel => {
        channel.links = [];
        channel.links = req.body.newLinks;
        return channel.save();
    })
    .then(channel => {
        return res.status(200).json({message: "Links updated."});
    })
    .catch(err => {
        logger.error(err.stack);
        res.status(500).json({
            message: "A problem occurred. Please try again later."
        }); 
    });
};

exports.postCreateUserForProject = (req, res, next) => {
    const projectId = req.params.projectId;
    const userId = req.body.user;
    Promise.all([
        Project.findById(projectId),
        User.findById(userId)
    ])
    .then(result => {
        const [project, user] = result;
        if (project.users.includes(userId)) {
            throw new Error('This user already exists in this Project.');
            
        }
        const newUserProject = {
            projectName : project.name,
            level: req.body.level
        };
        if (!user.projects) user.projects = {};
        user.projects[projectId] = newUserProject;
        user.projectsNo ++;
        user.markModified('projects');
        project.users.push(userId);
        return Promise.all([user.save(), project.save() ]);
    })
    .then(savedResult => {
        const [ user, project] = savedResult;
        logger.info(`User ${user.fullname} added on ${project.name} project.`);
        return res.status(201).json({user, project});
    })
    .catch(err => {
        if (err.message === "This user already exists in this Project.") {
            res.status(422).json({
                message: err.message
            });
        } else {
            logger.error(err.stack);
            res.status(500).json({
                message: "A problem occurred. Please try again later."
            });
        }
    });
};

exports.putEditUserForProject = (req, res) => {
    const projectId = req.params.projectId;
    const userId = req.params.userId;
    User.findById(userId)
    .then(user => {
        user.projects[projectId].level = req.body.level;
        user.markModified('projects');
        return user.save();
    })
    .then(result => {
        logger.info(`${result.fullname}'s level changed on project ${result.projects[projectId].projectName}`);
        res.status(200).json({user: result, message: "Level changed."});
    })
    .catch(err => {
        logger.error(err.stack);
        res.status(500).json({
            message: "A problem occurred. Please try again later."
        }); 
    });
};

exports.deleteUserForProject = (req, res) => {
    const projectId = req.params.projectId;
    const userId = req.params.userId;
    User.findById(userId)
    .then(user => {
        // delete project from user.
        delete user.projects[projectId];
        user.projectsNo --;
        user.markModified('projects');
        return Promise.all([
            user.save(),
            // delete user from project.
            Project.update({_id: projectId}, { $pull: { users :  userId } } )
        ]);
    })
    .then(result => {
        const [userUpd, project] = result;
        logger.info(`User ${userUpd.fullname} removed from Project with id ${projectId}.`);
        res.status(204).json({
            message: "User deleted."
        }); 
    })
    .catch(err => {
        logger.error(err.stack);
        res.status(500).json({
            message: "A problem occurred. Please try again later."
        }); 
    });
};