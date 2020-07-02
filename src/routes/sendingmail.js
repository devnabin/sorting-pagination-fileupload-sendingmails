const express = require("express");
const router = express.Router();
const sgMail = require("@sendgrid/mail");

router.get("/sendmail", (req, res) => {
  res.render("sendmail");
});

router.post("/sendmail", (req, res) => {
  console.log(req.body)
  sgMail.setApiKey(process.env.SendGride_Email_Key);
  const msg = {
    to: req.body.email,
    from: "nabin123456j@gmail.com",
    subject: req.body.subject,
    text: req.body.des,
    /* html: `
    <h1>Hello From Nabin Bhandari</h1>
    <br><br>
    <img src='https://3.bp.blogspot.com/-4w4p2wQIZ48/XH87f5LNMuI/AAAAAAAABD8/87A55pBig0gQA7KwLDO15nj7fyG9LCrzgCLcBGAs/s400/GMAIL%2BNEW%2BUPDATE.jpg'/>
    `, */
  };
  sgMail.send(msg);

  res.send({res : req.body});
});

module.exports = router;
