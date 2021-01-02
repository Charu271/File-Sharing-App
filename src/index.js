const express = require("express");
const port = process.env.PORT || 3000;
const app = express();
const connectDb = require("./db/mongoose.js");
connectDb();

const fileRouter = require("./routes/file");
app.use(fileRouter);

app.listen(port, () => {
  console.log("Server is up at port " + port);
});
