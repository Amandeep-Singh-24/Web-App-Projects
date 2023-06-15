var express = require('express');
var router = express.Router();
var {isLoggedIn} = require('../middleware/auth');
var db = require('../conf/database')

router.post('/create', isLoggedIn, async function(req,res,next){
    var {userId} = req.session.user;
    var {postId, comment} = req.body;
    try {
        var [insertResult, _] = await db.execute(
            `INSERT INTO comments (text, fk_postId, fk_authorId) VALUE (?,?,?)`,
            [comment,postId,userId]
        );
        if(insertResult && insertResult == 1){
            return res.status(201).json({
                insertResult:insertId,
                username,
                comment,
            });
        } else {
            
        }
    } catch (error) {
        next(error)
    }
});





module.exports = router;