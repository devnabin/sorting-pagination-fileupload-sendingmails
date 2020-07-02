const mongoose = require('mongoose')
const Schema = mongoose.Schema
let blogSchema = new Schema({
    title: {
      type : String,
      required : true
    },
    description : {
        type : String,
        required : true
    },
    blogpic : {
      type : Buffer
    }
  },{
    timestamps: true,
  });

  // compile our model
  var blog = mongoose.model('blog', blogSchema);


  module.exports = blog;