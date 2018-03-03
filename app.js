var fs=require("fs");
const express = require('express');
const reload = require('reload');
const chart = require('chart.js');
const mongoose = require('mongoose');

const app = express();

//Global variables
const port=process.env.PORT || 9090;

//Set Database connection
mongoose.connect('mongodb://localhost/caudit')
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

//Static folder path for images, stylesheets and scripts
app.use(express.static('static'));

//Set EJS templating engine
app.set('view engine', 'ejs');
app.set('views', './views/');


//Routes
app.use(require('./routes/index'));
app.use(require('./routes/controls'));
app.use(require('./routes/audits'));
app.use(require('./routes/account'));

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
