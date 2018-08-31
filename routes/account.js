var express = require('express');
var router = express.Router();

var nodemailer = require('nodemailer');

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
require('../models/User');
const User = mongoose.model('users');

const { ensureAuthenticated } = require('../helpers/auth');

var transporter = nodemailer.createTransport({
                     service: 'gmail',
                     auth: {
                            user: process.env.GMAIL,
                            pass: process.env.GMAIL_PASS
                        }
});

//Code for account profile view and edit
router.get('/account',ensureAuthenticated,function(request, response){
    response.render('account/profile',{
      pageTitle: 'Account Profile',
      pageId: 'accountprofile'
    });
});

router.post('/account',ensureAuthenticated,function(request,response){
    response.render('account/profile',{
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
      successRedirect: '/account/verified',
      failureRedirect: '/account/error',
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
          res.redirect('/account/register');
        } else {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            verified: 0
          });
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) {
                res.send(err);
              } else {
                newUser.password = hash;
                newUser.save()
                  .then(user => {
                   
                    const mailOptions = {
                        from: process.env.GMAIL, // sender address
                        to: user.email, // list of receivers
                        subject: 'Verify your CAudit account', // Subject line
                        html: '<p>Hi '+user.name+',</p><p>Please verify your CAudit account by clicking on this link: <a href="'+process.env.SITE_URL+'account/verify/'+user._id+'">Verify Account</a></p>Regards, <br> CAudit Team'
                    };

                    transporter.sendMail(mailOptions, (err, info) => {
                       if(err){
                         req.flash('error_msg','Unable to send email to your email address');
                       }
                       else{
                         req.flash('success_msg', 'A verification email has been sent to your email address. Please verify your account.');
                       }
                       res.redirect('/account/login');
                    });

                    
                    
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

router.get('/account/verify/:uid',(req,res) => {
    

    User.findOneAndUpdate({_id: req.params.uid},{verified: 1}, (err, user) => {
        if(err){
          req.flash('error_msg', "Sorry, we were unable to verify your account.");
        }else{
          req.flash('success_msg', "Success, your account has been verified.");
        }

        res.redirect('/account/login');
    }); 
});

router.get("/account/verified", (req,res) =>{
    if(req.user.verified==1){
      res.redirect('/');
    }else{
          req.flash('error_msg', 'Sorry, your account is not verified. Please check your inbox and verify your CAudit account.');
          res.redirect('/account/login');
    }

});

router.get("/account/error", (req,res) =>{
          req.flash('error_msg', 'Incorrect email or password');
          res.redirect('/account/login');
});

router.get("/account/fg-password", (req,res) => {

     res.render('account/fg-password',{
      pageTitle: 'Forgot Password',
      pageId: 'forgotpassword'
    });
});

router.post("/account/fg-password", (req,res) => {

     var dt = new Date();
     User.findOneAndUpdate({email: req.body.email},{pwd_expiry: dt}, (err, user) => {
        if(err){
          req.flash('error_msg', "Unable to find account associated with your email address");
          res.redirect('/account/login');
        }else{
          const mailOptions = {
                        from: process.env.GMAIL, // sender address
                        to: user.email, // list of receivers
                        subject: 'Reset password for your CAudit account', // Subject line
                        html: '<p>Hi '+user.name+',</p><p>Please reset your CAudit account password by clicking on this link: <a href="'+process.env.SITE_URL+'account/reset-pwd/'+user._id+'">Reset Password</a></p>Regards, <br> CAudit Team'// plain text body
                    };

          transporter.sendMail(mailOptions, (err, info) => {
             if(err){
               req.flash('error_msg','Unable to send email to your email address');
             }
             else{
               req.flash('success_msg','An email has been sent to your email address. Please follow the instructions and reset your password');
             }

             res.redirect('/account/fg-password');
             
          });            
        }

        
    });
});

router.get('/account/reset-pwd/:uid',(req,res) => {

      res.render('account/reset-pwd',{
                pageTitle: 'Reset Password',
                pageId: 'resetpassword',
                uid: req.params.uid
      });

});


router.post('/account/reset-pwd/:uid',(req,res) => {
    
    User.findOne({_id: req.body.uid},(err,user) =>{

        start_date = user.pwd_expiry.getHours();
        end_date = new Date();

        end_date = end_date.getHours();
        duration = end_date - start_date;

        if(duration < 5 && duration >= 0){

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(req.body.password, salt, (err, hash) => {


                    User.findOneAndUpdate({_id: req.body.uid}, { password: hash }, (err, result)=>{
                        if(err){
                          req.flash('error_msg', 'Unable to reset your password');
                        }else{
                          req.flash('success_msg', 'Your password has been reset successfully');
                        }

                        res.redirect('/account/login');
                    });
                });
            });
            
        }else{
           req.flash('error_msg', 'The password reset link has expired. Please try again');
           res.redirect('/account/fg-password');        
        }

    });  

});





router.get('/account/logout', (req,res)=>{
  req.logout();
  req.flash('success_msg', 'You have logged out of caudit.');
  res.redirect('/account/login');
});

module.exports = router;