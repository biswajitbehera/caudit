var express = require('express');
var router = express.Router();

router.get('/',function(request, response){
    response.render('index',{
      pageTitle: 'Home',
      pageId: 'home'
    });
})

module.exports = router;
