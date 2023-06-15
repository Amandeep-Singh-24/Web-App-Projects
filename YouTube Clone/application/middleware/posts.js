var pathToFFMPEG = require('ffmpeg-static');
var exec = require('child_process').exec;
var db = require('../conf/database');



module.exports = {
    makeThumbnail : function(req,res,next){
        if(!req.file){
            next(new Error('File upload failed'));
        }else{
            try{
            var destinationOfThumbnail = `public/images/uploads/thumbnail-${req.file.filename.split(".")[0]}.png`
            var thumbnailCommand = `${pathToFFMPEG} -ss 00:00:03 -i ${req.file.path} -y -s 200x200 -vframes 1 -f image2 ${destinationOfThumbnail}`;
            exec(thumbnailCommand);
            req.file.thumbnail = destinationOfThumbnail;
            next();
            }catch(error){
                next(error);
            }
            
        }
    },
    getPostsForUserBy: async function(req,res,next){
        var userId = req.params.id;
        try {
            let[rows, _] = await db.execute(
                `SELECT p.title, p.description, p.createdAt, p.video
                FROM posts p
                JOIN users u
                ON p.fk_userId = u.id
                WHERE u.id = ?;`, 
                [userId]
            );
            res.locals.userPosts = rows;
            next();
        } catch (error) {
            next(error);
        }
    },
    getPostById: async function(req,res,next){
        var {id} = req.params;
        try {
            let[rows, _] = await db.execute(
                `SELECT u.username, p.video, p.title, p.description,p.id,p.createdAt
                from posts p
                JOIN users u
                ON p.fk_userId = u.id
                WHERE p.id =?;`, 
                [id]
            );

            const post = rows[0];
            if(!post){
                return next(new Error(`No post found with this id: ${id}`));
            }else {
                res.locals.currentPost = post;
                next();
            }
        } catch (error) {
            next(error);
        }
    },
    getCommentsForPostById: async function(req,res,next){    
        var {id} = req.params;
    try {
        let[rows, _] = await db.execute(
            `SELECT u.username, c.text, c.createdAt
            from comments c
            JOIN users u
            ON c.fk_authorId = u.Id
            WHERE c.fk_postId = ?;`, 
            [id]
        );
            res.locals.currentPost.comments = rows;
            next();
        
    } catch (error) {
        next(error);
    }},
    getRecentPosts: function(req,res,next){},
    getCommentedPostsForUserBy: async function(req,res,next){
        var userId = req.params.id;
        try {
            let[rows, _] = await db.execute(
                `SELECT p.title, p.description, p.createdAt, p.video
                FROM posts p
                JOIN comments c
                ON p.id = c.fk_postId
                JOIN users u
                ON c.fk_authorId = u.id
                WHERE u.id = ?;`, 
                [userId]
            );
            res.locals.userCommentedPosts = rows;
            next();
        } catch (error) {
            next(error);
        }
    },
    getUserPosts: async function(req,res,next){
        var userId = req.params.id;
        try {
            let[rows, _] = await db.execute(
                `SELECT *
                from posts
                WHERE fk_userId = ?;`, 
                [userId]
            );
            res.locals.userPosts = rows;
            next();
        } catch (error) {
            next(error);
        }
    }
    
    
};