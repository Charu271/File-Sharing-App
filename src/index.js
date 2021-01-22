const path = require("path");
const express = require("express");
const cors = require("cors");
const Cron = require("node-cron");
const port = process.env.PORT || 3000;
const app = express();
const connectDb = require("./db/mongoose.js");
connectDb();
const deleteFiles = require("./script");

Cron.schedule("0 2 * * *", deleteFiles);

const corsOptions = {
  origin: process.env.ALLOWED_PORTS.split(","),
};
app.use(cors(corsOptions));

app.use(express.json());
const publicDirectoryPath = path.join(__dirname, "./public");
console.log(publicDirectoryPath);
app.use(express.static(publicDirectoryPath));
const viewsPath = path.join(__dirname, "./views");

console.log(viewsPath);
app.set("views", viewsPath);
app.set("view engine", "ejs");

const fileRouter = require("./routes/file");
app.use("/api/files", fileRouter);
app.use("/files", require("./routes/show.js"));
app.use("/files/download", require("./routes/download"));

app.listen(port, () => {
  console.log("Server is up at port " + port);
});
