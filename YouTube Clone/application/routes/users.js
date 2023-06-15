var express = require('express');
var router = express.Router();
var db = require('../conf/database');
var bcrypt = require('bcrypt');
var {isLoggedIn, isMyProfile} = require("../middleware/auth");
const { usernameCheck, passwordCheck, emailCheck, tosCheck, ageCheck, isUsernameUnique, isEmailUnique } = require('../middleware/validation');

//localhost:3000/users/registration
router.post('/registration', usernameCheck, isUsernameUnique, isEmailUnique, async function(req, res, next){
    var {username,email,password} = req.body;
    //check username uniqueness
    try{
      var hashedPass = await bcrypt.hash(password, 3);

      var [resultObject, fields] = await db.execute(`INSERT INTO users
      (username,email,password)
      VALUE
      (?,?,?);`, [username, email, hashedPass]);
    //insert
    //respond
    if(resultObject && resultObject.affectedRows == 1){
      res.redirect("/login");
    }
    else{
      return res.redirect("/registration");
    }

    }catch(error){
      next(error);
    }
   
});

//localhost:3000/users/login
router.post('/login', async function(req,res,next){
  var {username,password} = req.body;
  //check if username/passwords match
  try {
    var [rows,fields] = await db.execute(`SELECT id,username,password,email FROM users WHERE username = ?;`, [username]);
    var user = rows[0];
    if(!user){
      req.flash("error", `LogIn failed: Invalid username/password`);
      req.session.save(function(err){
          return res.redirect("/login");
      })
    } else {
      var passwordsMatch = await bcrypt.compare(password, user.password);
      if(passwordsMatch){
            req.session.user = {
              userId : user.id,
              email: user.email,
              username: user.username
            };
            res.redirect('/posts/search?searchValue=');
      }
    else{
      return res.redirect("/login");
    }
  }
  } catch (error) {
    next(error);
  }
})

router.get("/profile/:id(\\d+)",isLoggedIn,isMyProfile, function(req,res){
  console.log(req.params);
  res.render("profile");
});

//localhost:3000/users/logout
router.get('/logout', function(req, res, next){
  req.session.destroy(function(err){
    if(err){
      next(error);
    }
    return res.redirect('/');
  })
});

module.exports = router;
