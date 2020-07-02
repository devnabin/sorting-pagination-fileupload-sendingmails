const express = require("express");
const app = express();
const path = require("path");

//moongoose
require("../database/mongo");

const Port = process.env.PORT;

//PATH FOR STATIC FILES
const staticPath = path.join(__dirname, "../public");

app.use(express.static(staticPath));

//to get json data
app.use(express.json());

//--
//profile pic router
const profileimgroute = require("./routes/imageup");
const sendmail = require("./routes/sendingmail");
app.use(profileimgroute);
app.use(sendmail);
//--

//===============================
const hbs = require("hbs");

//Setting hbs to views engine
app.set("view engine", "hbs");

//getting homepage route
app.get("/", (req, res) => {
  res.render("index");
});

//getting image route
app.get("/image", (req, res) => {
  res.render("image");
});

//time route
app.get("/time", (req, res) => {
  let time = Date();
  time = time.split(" ");
  const date = time[0] + " " + time[1] + " " + time[2] + " " + time[3];
  time = time[4] + " " + time[5];
  res.send({ date, time });
});

///blog end point =============================================

//blog model
const blog = require("../database/model/blog");

//===============================================================================================
//rest api for blog
//getting blogdata
app.get("/blog", async (req, res) => {
  try {
    // const allPost = await blog.find({});
    let allPost;
    if (!req.query) {
      allPost = await blog.find({});
    } else {
      const limit = parseInt(req.query.limit);
      const skip = parseInt(req.query.skip);
      allPost = await blog.find({}).limit(limit).skip(skip).sort({
        createdAt: 1,
      });
    }
    res.send(allPost);
  } catch (error) {
    res.status(400).send({ blogFound: "no blog" });
  }
});

//get post by id

app.get("/post/:id", async (req, res) => {
  try {
    const post = await blog.findById(req.params.id);
    if (!post) return res.status(404).send({ post: "no post" });
    post.blogpic = undefined;
    res.send(post);
  } catch (error) {
    res.status(400).send({ error: "no post" });
  }
});

//post
app.get("/post", (req, res) => {
  res.render("post");
});

//getting pic by that id
app.get("/blog/:id/pic/", async (req, res) => {
  try {
    const user = await blog.findById(req.params.id);
    if (!user || !user.blogpic) {
      throw new Error();
    }
    //this content type header should be mention , because without it postman show sothing binary data
    res.set("Content-Type", "image/png");
    res.send(user.blogpic);
  } catch (error) {}
});

app.patch("/blog", (req, res) => {
  res.send("hi");
});

app.delete("/blog", async (req, res) => {
  await blog.deleteMany();
  res.send({ message: "Data Deleted" });
});

//Post req below as file handling
//===============================================================================================
//all about image or file handing
const multer = require("multer");
const sharp = require("sharp");
const { all } = require("./routes/sendingmail");

//middleware for file upload
const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png)/)) {
      return cb(
        new Error("please upload file name with png , jpg and jepg only ")
      );
    }
    cb(undefined, true); //gives ok
  },
});

app.post(
  //route
  "/blog",

  //middleware for file (multer)
  upload.single("upload"),

  //our express handler funciton
  async (req, res) => {
    /*
    console.log(req.body)
   req.body will gives:-
   $  [Object: null prototype] { title : 'any' , description : 'any'}
   so to remove [Object: null prototype] or this we stringify and then parse as below 👎👎 ⏬⬇⬇
    */

    const obj = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'product' }    console.log(obj);

    //saving to database
    const post = await blog(obj);
    if (!post) {
      throw new Error();
    }

    //adding buffer  or file to database
    if (req.file) {
      post.blogpic = req.file.buffer;
    }
    //saving the post
    await post.save();

    res.send(post);
  },
  //handaling the multer error
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

//=======================================================================================

app.listen(Port, () => console.log(`app is listen on Port ${Port}`));
