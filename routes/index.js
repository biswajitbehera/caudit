var express = require('express');
var router = express.Router();

const { ensureAuthenticated } = require('../helpers/auth');

router.get('/',ensureAuthenticated,function(request, response){
    response.render('index',{
      pageTitle: 'Home',
      pageId: 'home'
    });
})

module.exports = router;
