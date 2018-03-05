const mongoose = require("mongoose");

const constants = require("./constants");
const { Mongo_URL } = constants;

mongoose.Promise = global.Promise;

try {
  mongoose.connect(Mongo_URL, () => console.log("mongodb is connected"));
} catch (error) {
  mongoose.createConnection(Mongo_URL);
}

mongoose.connection
  .once("open", () => console.log("mongo db is running"))
  .on("error", error => {
    throw new Error(error);
  });
