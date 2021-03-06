var express = require('express');
var router = express.Router();
var userQueries = require('../controllers/database/users/userQueries')
var db = require('../config/db')
var modelBase = require('bookshelf-modelbase')(db.bookshelf)
var bcrypt = require('bcrypt')
var passport = require('passport')
var userTable = modelBase.extend({ tableName: 'e2e_users' })
// login route
router.route('/')
  .get((req, res, next) => {
    res.render('login/index')
  })
  .post(passport.authenticate('local', { failureRedirect: '/login'}),
  (req, res, next) => {
    console.log(req.session);
    res.redirect('/dashboard')

  })
  
// forgot password
router.get('/forgot_pass', (req, res, next) => {
  res.render('login/forgot_pass')
})

// register
router.route('/register')
  .get((req, res, next) => {
    res.render('login/register')
  })
  .post((req, res, next) => {
    console.log(req.body);
    
    userQueries.createUserIfNotExists(req.body).then((resp) => {
      res.render('login/index', {message:"Account created. Please login."})
    }).catch((e) => console.log(e))
  })

// after oauth register
router.route('/completeRegistration')
  .get((req, res, next) => {
    res.render('login/additional_info', {
      id: req.session.passport.user.id
    })
  })
  .post((req, res, next) => {
   userQueries.additionalLoginInfo(req.body.id, {
     e2e_password: req.body.e2e_password,
     e2e_username: req.body.e2e_username
   }).then((resp) => {
      res.redirect('/dashboard')
    })
  })

module.exports = router;
