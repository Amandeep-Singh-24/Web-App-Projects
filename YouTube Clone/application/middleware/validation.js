var validator = require('validator');
var db = require('../conf/database');
module.exports = {
    usernameCheck: function(req,res,next){
        var {username} = req.body;
        username = username.trim();
    
        if(!validator.isLength(username, {min:3})){
            req.flash("error", "username must be 3 or more characters");
        }
    
        if(!/[a-zA-Z]/.test(username.charAt(0))){
            req.flash("error", "username must begin with a character");
        }
    
        if(req.session.flash.error){
            res.redirect('/registration');
        } else{
            next();
        }
    },
    
    passwordCheck: function(req,res,next){
        var {password} = req.body;

        if(!validator.isLength(password, {min:8})){
            req.flash("error", "Password must be at least 8 characters long");
        }

        if(!/[A-Z]/.test(password)){
            req.flash("error", "Password must contain at least 1 upper case character");
        }

        if(!/[/*-+!@#$^&~[\]]/.test(password)){
            req.flash("error", "Password must contain at least 1 special character / * - + ! @ # $ ^ & ~ [ ]");
        }

        if(!/\d/.test(password)){
            req.flash("error", "Password must contain at least 1 number");
        }

        if(req.session.flash.error){
            res.redirect('/registration');
        } else{
            next();
        }
    },

    confirmPasswordCheck: function(req,res,next){
        var {password, confirmPassword} = req.body;

        if(password !== confirmPassword){
            req.flash("error", "Passwords do not match");
            res.redirect('/registration');
        } else{
            next();
        }
    },

    emailCheck: function(req,res,next){
        var {email} = req.body;

        if(!validator.isEmail(email)){
            req.flash("error", "Invalid email format");
            res.redirect('/registration');
        } else{
            next();
        }
    },
    tosCheck: function(req,res,next){},
    ageCheck: function(req,res,next){},
    isUsernameUnique: async function(req,res,next){
        var {username} = req.body;
        try {
            var [rows, fields] = await db.execute(`select id from users where username =?;`, [username]);
            if(rows && rows.length > 0){
                req.flash("error", `${username} is already taken`);
                return req.session.save(function(err) {
              return res.redirect('/registration');
            });
        } else{
            next();
        }
     } catch (error) {
            next(error);
        }
    },
    isEmailUnique: async function(req,res,next){
        var {email} = req.body;
        try {
            var [rows, fields] = await db.execute(`select id from users where email =?;`, [email]);
            if(rows && rows.length > 0){
                req.flash("error", `${email} is already taken`);
                return req.session.save(function(err) {
              return res.redirect('/registration');
            });
        } else{
            next();
        }
        } catch (error) {
            next(error);
        }
    },
};