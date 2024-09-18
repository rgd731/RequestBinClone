require("dotenv").config();
const mongoose = require("mongoose");
const requestPayload = require("./requestPayload");

const mongoDbUrl = process.env.MONGO_URI;

mongoose
  .connect(mongoDbUrl)
  .then(() => {
    console.log("MongoDB Connection Successful!");
  })
  .catch(() => {
    console.log("MongoDB Connection Failed!");
  });

const addRequestPayload = async (req) => {
  const requestLog = new requestPayload({
    method: req.method,
    path: req.originalUrl,
    headers: req.headers,
    body: req.body,
  });

  try {
    await requestLog.save();
    console.log("Request logged successfully");
  } catch (error) {
    console.error("Error logging request:", error);
  }
  return requestLog.id;
};

const getMongoData = async () => {
  const data = await requestPayload.find().exec();

  return data;
};

const fetchDocumentsById = async (ids) => {
  try {
    const documents = await requestPayload.find({ _id: { $in: ids } }).exec();
    return documents;
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  addRequestPayload,
  fetchDocumentsById,
  getMongoData,
};
