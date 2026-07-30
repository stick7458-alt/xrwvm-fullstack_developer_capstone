const mongoose = require("mongoose");

const DealerSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  full_name: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  address: { type: String },
  lat: { type: Number },
  long: { type: Number },
  short_name: { type: String },
  st: { type: String },
});

module.exports = mongoose.model("Dealer", DealerSchema);
