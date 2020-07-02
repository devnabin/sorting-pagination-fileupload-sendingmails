const mongoose = require("mongoose");
mongoose.connect(process.env.mongoServer, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
