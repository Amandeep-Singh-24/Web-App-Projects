var express = require('express');
var router = express.Router();
var multer = require('multer');
const { makeThumbnail, getPostById, getCommentsForPostById } = require('../middleware/posts');
var db = require('../conf/database');
const { isLoggedIn } = require('../middleware/auth');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/videos/uploads")
    },
    filename: function (req, file, cb) {
      var fileExt = file.mimetype.split("/")[1];  
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExt}`);
    },
  });
  
  const upload = multer({ storage: storage })


router.post(
    "/create", 
    isLoggedIn,
    upload.single("uploadVideo"), 
    makeThumbnail, 
  async function(req,res,next){
   var {title, description} = req.body;
   var {path, thumbnail} = req.file;
   var {userId} = req.session.user;

try {
    var [insertResult, _ ] = await db.execute(
        `INSERT INTO posts (title,description,video,thumbnail,fk_userId) VALUE (?,?,?,?,?);`,
        [title,description,path,thumbnail,userId]
    );
    if(insertResult && insertResult.affectedRows){
        req.flash("success", "Your post was created!");
        return req.session.save(function(error){
            if(error) next(error);
            return res.redirect(`/`);
        })
    } else {
        next(new Error('Post could not be created'));
    }
} catch (error) {
    next(error);
}
});


router.get(":id(\\d+)",isLoggedIn, getPostById ,getCommentsForPostById, function(req, res) {
  res.render('viewpost',{title: `View Post ${req.params.id}`, css:["style.css"]})
});

router.get("/search", async function(req, res, next) {
  var { searchValue } = req.query;
  try {
    var rows;

    if (!searchValue) {
      // Retrieve all posts if searchValue is empty
      [rows, _] = await db.execute("SELECT id, title, thumbnail FROM posts");
    } else {
      // Perform the search query
      [rows, _] = await db.execute(
        `SELECT * FROM (
          SELECT id, title, thumbnail, concat_ws(' ', title, description) as haystack
          FROM posts) t
        WHERE t.haystack LIKE ?`,
        [`%${searchValue}%`]
      );
    }

    res.locals.posts = rows;
    return res.render("index");
  } catch (error) {
    next(error);
  }
});

  

router.delete("/delete/:id(\\d+)", isLoggedIn, async function(req, res, next){
  const postId = req.params.id;
  const { userId } = req.session.user;
  try {
      var [deleteResult, _] = await db.execute(
          `DELETE FROM posts WHERE id = ? AND fk_userId = ?;`,
          [postId, userId]
      );
      if (deleteResult.affectedRows) {
          req.flash("success", "Your post was deleted!");
          return req.session.save(function(error){
              if(error) next(error);
              return res.redirect(`/profile`);
          })
      } else {
          throw new Error('Post could not be deleted or does not exist');
      }
  } catch (error) {
      next(error);
  }
});



module.exports = router;