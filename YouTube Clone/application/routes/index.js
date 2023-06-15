var express = require('express');
var router = express.Router();
const{isLoggedIn} = require('../middleware/auth');
const {getRecentPosts, getPostById, getCommentsForPostById, getPostsForUserBy, getUserPosts, getCommentedPostsForUserBy} = require('../middleware/posts')

/* GET home page. */

router.get('/', function(req, res, next) {
  res.redirect('/posts/search');
});


router.get('/login', function(req, res){
  res.render('login', { title: 'Login'});
})

router.get('/registration', function(req, res){
  res.render('registration', { title: 'Registration', js:["validation.js"]});
})

router.get('/postvideo', isLoggedIn, function(req, res){
  if(req.session.user){
  res.render('postvideo', { title: 'Postvideo', user: req.session.user});
  }
});

router.get('/profile/:id(\\d+)', isLoggedIn, getUserPosts, getCommentedPostsForUserBy, function(req, res){
  if(req.session.user){
      res.render('profile', { title: `Profile ${req.params.id}`, user: req.session.user, userPosts: res.locals.userPosts });
  }
});


router.get("/posts/:id(\\d+)",isLoggedIn, getPostById ,getCommentsForPostById, function(req, res) {
  res.render('viewpost',{title: `View Post ${req.params.id}`, css:["style.css"]})
});



module.exports = router;
