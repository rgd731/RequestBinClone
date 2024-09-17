require("dotenv").config();
const mongoose = require("mongoose");
const Test = require("./requestPayload");

const mongoDbUrl = process.env.MONGO_URI;

mongoose
  .connect(mongoDbUrl)
  .then(() => {
    console.log("MongoDB Connection Successful!");
  })
  .catch(() => {
    console.log("MongoDB Connection Failed!");
  });

const addTestKey = async (req, res) => {
  const testKey = new Test({
    key: req.body.key,
  });

  const result = await testKey.save();

  res.json(result);
};

const getKeys = async () => {
  const keys = await Test.find().exec();

  return keys;
};

const getMongoData = async () => {
  const data = await Test.find().exec();

  return data;
}

const fetchDocumentsById = async (ids) => {
  try {
      const documents = await Test.find({ _id: { $in: ids } }).exec();
      return documents;
  } catch (err) {
      console.error(err);
  }
}

module.exports = {
  addTestKey,
  getKeys,
  getMongoData,
  fetchDocumentsById,
};
