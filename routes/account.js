var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
require('../models/User');
const User = mongoose.model('users');

const { ensureAuthenticated } = require('../helpers/auth');

//Code for account profile view and edit
router.get('/account',ensureAuthenticated,function(request, response){
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

router.post('/account/login',function(req,res,next){
    passport.authenticate('local', {
      successRedirect: '/controls',
      failureRedirect: '/account/register',
      failureFlash: true
    })(req, res, next);
});

//Code for register POST
router.post('/account/register', (req, res)=>{
  let errors = [];

  if (req.body.password.length < 4) {
    errors.push({
      text: 'Passwords must be at least 4 characters'
    })
  }
  if (errors.length > 0) {
    res.render('/account/register', {
      errors: errors,
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
    })
  } else {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (user) {
          req.flash('error_msg', 'E-mail already registered');
          res.redirect('/users/register');
        } else {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
          });
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) {
                res.send(err);
              } else {
                newUser.password = hash;
                newUser.save()
                  .then(user => {
                    req.flash('success_msg', 'You are now registered and can log in');
                    res.redirect('/account/login');
                  }).catch(err => {
                    console.log(err);
                  })
              }
            });
          })
        }
      });
  }
});

router.get('/account/logout', (req,res)=>{
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/');
});

module.exports = router;