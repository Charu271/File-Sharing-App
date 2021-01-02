const mongoose = require("mongoose");

function connectDB() {
  mongoose.connect(process.env.MONGO_DATABASE_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  });
  const connection = mongoose.connection;
  connection.once("open", () => {
    console.log("Database connected");
  });
}

module.exports = connectDB;
