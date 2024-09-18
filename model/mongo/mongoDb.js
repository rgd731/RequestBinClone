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

const deleteDocumentsByIds = async (ids) => {
  // Convert string IDs to mongoose ObjectId instances
  const objectIds = ids.map(id => new mongoose.Types.ObjectId(id));

  try {
    const result = await requestPayload.deleteMany({
      _id: { $in: objectIds }
    });

    console.log(`${result.deletedCount} documents deleted.`);
    console.log(result);
    return result;
  } catch (err) {
    console.error('Error deleting documents:', err);
    throw err;
  }
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

const deleteById = async(id) => {
  try {
    const result = await requestPayload.findByIdAndDelete(id);
    if (result) {
      console.log("Document successfully deleted: ", result);
      return true;
    } else {
      console.log("No document found");
    }
  } catch (error) {
    console.log("Error deleting document:", error);
  }
}

module.exports = {
  addRequestPayload,
  fetchDocumentsById,
  getMongoData,
  deleteById,
  deleteDocumentsByIds,
};
