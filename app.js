var fs=require("fs");
var express = require('express');
var reload = require('reload');
var app = express();
const port=process.env.PORT || 9090;

//Read JSON
var dataFile = fs.readFileSync('data/controls.json');
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
