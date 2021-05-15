const mongoose = require("mongoose");
const schema = mongoose.Schema;

const data = new schema({
  id: Number,
  ownerID: Number,
  prefix: String,
  description: String,
  shortDesc: String,
  invite: String,
  category: [],
  library: String,
  status: Boolean
});

module.exports = mongoose.model("listbot", data);