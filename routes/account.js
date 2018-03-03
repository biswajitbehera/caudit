var express = require('express');
var router = express.Router();

//Code for account profile view and edit
router.get('/account',function(request, response){
    response.render('index',{
      pageTitle: 'Account Profile',
      pageId: 'accountprofile'
    });
});

//Code for new account registration
router.get('/account/register',function(request, response){
    response.render('account/register',{
      pageTitle: 'Register',
      pageId: 'register'
    });
});

//Code for logging in and redirect to home page
router.get('/account/login',function(request, response){
    response.render('account/login',{
      pageTitle: 'Login',
      pageId: 'login'
    });
});

//Code for register POST
router.post('/account/register', (request, response)=>{
  console.log(request.body);
  response.send('register');
});

module.exports = router;
