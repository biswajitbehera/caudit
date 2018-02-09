var express = require('express');
var router = express.Router();

//Get all cbsp controls
router.get('/controls',function(request, response){
  var info ='';
  var count = 0;
  data = request.app.get('appData');

// Need to improvise he array.

  response.render('controls',{
    pageTitle: 'Cloud Controls',
    pageId:'controls',
    controls:data.controls
  })
  // response.send(`
  //   <h1>CBSP Controls</h1>
  //   <p>Total contols:${count}</p>
  //   ${info}
  //   `)
})

//Get details of a single control
router.get('/controls/:cid',function(request, response){
  data = request.app.get('appData');
  var control = data.controls[request.params.cid];

  response.render('cdetail',{
    pageTitle: 'Cloud Control Details',
    pageId: 'cdetail',
    control: control
  })
})

module.exports = router;
