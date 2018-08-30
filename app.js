var fs=require("fs");
const express = require('express');
const reload = require('reload');
const chart = require('chart.js');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const app = express();
var bodyParser = require('body-parser');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

//Global variables
const port=process.env.PORT || 9090;

//Set Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDb connected.'))
  .catch(err => console.log(err));

//Read JSON
var dataFile = fs.readFileSync('data/controls/frameworks/NIST-800-53.json');
var data = JSON.parse(dataFile);

//Set locals
app.locals.siteTitle = 'CAUDIT';
app.locals.reportPath ="data/reports";

//Set data
app.set('appData',data);

//for receiving post data
app.use(bodyParser.urlencoded({ extended: false }));

//Static folder path for images, stylesheets and scripts
app.use(express.static('static'));

//session, passport and flash
app.use(session({
  secret: process.env.SECRET,
  cookie: {
    path: '/',
    httpOnly: true,
    secure: false,
    maxAge: 15 * 60000
  },
  rolling: true,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//Set EJS templating engine
app.set('view engine', 'ejs');
app.set('views', './views/');


//Routes
app.use(require('./routes/index'));
app.use(require('./routes/controls'));
app.use(require('./routes/audits'));
app.use(require('./routes/account'));



//Passport Config
require('./config/passport')(passport);

// for(var category in findings){
//   if (findings[category].status!="OK"){
//     console.log(findings[category].category+'\t'+findings[category].region +'\t'+findings[category].message);
//   }
// }

//Server startup
var server = app.listen(port,function(error){
  if(error == true){
    console.log("error");
  }else{
    console.log("listening on "+port)
  }
});

//Reload
reload(server, app)
