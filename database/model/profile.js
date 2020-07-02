const mongoose = require('mongoose')
const Schema = mongoose.Schema
let profileSchema = new Schema({
    avatars : {
      type : Buffer,
    }
  });

  // compile our model
  var profile = mongoose.model('profile', profileSchema);

  module.exports = profile;