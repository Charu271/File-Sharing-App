const path = require("path");
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 3000;
const app = express();
const connectDb = require("./db/mongoose.js");
connectDb();

const corsOptions = {
  origin: process.env.ALLOWED_PORTS.split(","),
};
app.use(cors(corsOptions));

app.use(express.json());

const viewsPath = path.join(__dirname, "./views");
app.set("views", viewsPath);
app.set("view engine", "ejs");

const fileRouter = require("./routes/file");
const publicDirectoryPath = path.join(__dirname, "./public");
app.use(express.static(publicDirectoryPath));
app.use("/api/files", fileRouter);
app.use("/files", require("./routes/show.js"));
app.use("/files/download", require("./routes/download"));

app.listen(port, () => {
  console.log("Server is up at port " + port);
});
