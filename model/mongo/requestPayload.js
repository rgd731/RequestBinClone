const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  method: { type: String, required: true },
  path: { type: String, required: true },
  headers: { type: Array, required: true }
});

testSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();

    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Test", testSchema);
