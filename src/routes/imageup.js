const express = require('express')
const router = new express.Router()


//=================================================================
//file upload =========================================
//By default expess is not able to get files( pdf | images | any)
//so multer is used to overcome this error
const multer = require("multer");
const sharp = require("sharp");

const upload = multer({
  // dest: "images", //dest means destination  image be the folder
  limits: {
    fileSize: 1000000, //limits file size in bytes , 1kb = 1024 byte and 1mb = 1024kb
  },
  fileFilter(req, file, cb) {
    //filter has 3 arguments  req , file and callback(cb)

    ////!Example 1 is where we can accept png  format only
    /*   if(!file.originalname.endsWith('.png')){
      ////? Orginalname is the object in multer and endwith() check the extension
     return cb(new Error('Please up load a png file'))
    } */

    /* 
    =====================================================================================================
Welcome to the regular expression
To learn regular expression visite this link
www.regex101.com
const fileType = 'file.doc'
1. in regular expression we can find the or search in this way
 >  \.doc$
as \. is looking for the dot and starts with its followed by doc and end with $sign

2. We can use or statement in parenthesis
>  \.(doc | docx )$
here any one of this should be true and one vertical bar is used instead of || as or operator
   =====================================================================================================

*/
    ////!Example 2 is where we can accept doc or docx  format only
    /*   if (!file.originalname.match(/\.(doc |docx)/)) {
      return cb(new Error("Please upload doc and docx document only"));
    }
 */

    ////!Example 3 is where we can accept some image format only

    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image"));
    }

    cb(undefined, true);

    /*  
    =====================================================================================================
   call backs are three cases as below :-
   cb(new Error ('file must be a pdf')) //checking file type
    cb(undefined , true)   //nothing went wrong , true means corret
    cb(undefined,false)    //reject the upload
    =====================================================================================================
    */
  },
});

//
const profile = require("../../database/model/profile");

router.post(
  "/image",
  upload.single("upload"),
  async (req, res) => {
    //To add that binary image in data base we need to remove dest property from that upload variable
    // req.file.buffer  ===> this contain the files comes from client

    const pp = await profile({ name: "Nabin Bhandari" });

    // pp.avatars = req.file.buffer; //With out sharp , this directly add the file to database

    //sharp node module is used to convert the file or modify the file type it's height width or any
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    /*
    the above sentence describe as :-
  1.sharp takes input as file (which is an  buffer)
  2.Then with the help of resize property (which takes object containing height and width) it will convert image
  3.Then .png() method is used to convert any image format  to png
  4.Then toBuffer() method is used to convert that sharp statement back into buffer file
      */
    pp.avatars = buffer;

    await pp.save();
    res.status(200).send({});
  },
  (error, req, res, next) => {
    res.status(400).send({error : error.message});
  }
);

router.delete("/image/:id", async (req, res) => {
  try {
    const _id = req.params.id
    const user = await profile.findById(_id);
    if(!user.avatars){
        throw new Error()
    }
    user.avatars = undefined;
    await user.save();
    res.send();
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/image/:id/user", async (req, res) => {
  try {    
    // app.get('/image/user/:id', async(req,res)=>{ //if we write id at last then its try or tends send to server so we cannot get our image
    const user = await profile.findById(req.params.id);
    if (!user || !user.avatars) {
      throw new Error();
    }
    //this content type header should be mention , because without it postman show sothing binary data
    res.set("Content-Type", "image/png");
    res.send(user.avatars);
  } catch (error) {
    res.status(400).send(error)
  }
});


module.exports = router;
//=================================================================
//=================================================================
