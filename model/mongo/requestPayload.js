const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  key: { type: String, minLength: 2, required: [true, " key required"] },
});

testSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();

    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Test", testSchema);
