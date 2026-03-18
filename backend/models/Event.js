
const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  query: String,
  response: Object
}, { timestamps: true });

module.exports = mongoose.model("Event", EventSchema);
