const mongoose = require("mongoose");

const mongoURI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,

});

// Get the default connection
const db = mongoose.connection;

// Event handling for MongoDB connection
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB successfully!");
});

exports.db = db;
