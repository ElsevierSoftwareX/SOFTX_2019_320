const path = require('path');
const express = require("express");

const passport = require("passport");
const authNavRoutes = require("./routes/authNavRoutes");
const navRoutes = require("./routes/navRoutes");
const authRestRoutes = require("./routes/authRestRoutes");
const adminRestRoutes = require("./routes/adminRestRoutes");
const restRoutes = require("./routes/restRoutes");
const vueTablesRoutes = require("./routes/vueTablesRoutes");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const setUpPassport = require("./conf/setuppassport");
const helmet = require('helmet');
const compression = require('compression');
const populatedb = require('./conf/populatedb');
const MONGODB_URI = "mongodb://localhost:27017/HC_4_PM";
const winston = require('./conf/winston');
const logger = winston.logger;
const app = express();
const http = require('http').createServer(app);
const Message = require('./models/message');
var io = require('socket.io')(http);
var sessionStore = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'mySessions'
});
const csrf = require("csurf");




mongoose.connect(MONGODB_URI, { useCreateIndex: true, useNewUrlParser: true, useFindAndModify: false });
const csrfProtection = csrf();
app.disable("x-powered-by");

setUpPassport();
app.use(compression());

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: 'secretHash4Sessions',
    resave: false,
    saveUninitialized: false,
    store: sessionStore
  })
);
app.use(csrfProtection);
app.use(helmet());

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// Send info and errors with every response.
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  res.locals.csrfToken = req.csrfToken();
  next();
});


app.use("/auth", authNavRoutes);
app.use(restRoutes);
app.use(navRoutes);
app.use("/rest/auth", authRestRoutes);
app.use("/rest/admin", adminRestRoutes);
app.use("/vue-tables", vueTablesRoutes);

app.use((req, res, next) => {
    res.status(404).render("400");
  });


app.use((error, req, res, next) => {
  logger.error(error.message);
  res.status(500).render('500');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    const newMessage = new Message(msg);
    newMessage.save()
    .then(message => {
      io.emit('chat message', message);
    })
    .catch(err => {
      console.log(err);
    });
  });
});

populatedb();
http.listen(3000, function(){
  console.log('listening on *:3000');
});