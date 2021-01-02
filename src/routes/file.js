const path = require("path");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const File = require("../models/file");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
  destination: (req, file, cb) => cb(null, "src/uploads/"),
});

let upload = multer({
  storage,
  limit: {
    fileSize: 100000000,
  },
}).single("myfile");

router.post("/", async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.log(err.message);
    }
    if (!req.file) {
      return res.json({ error: "File is not provided." });
    }
    const file = new File({
      filename: req.file.filename,
      size: req.file.size,
      path: req.file.destination,
      uuid: uuidv4(),
    });
    const response = await file.save();
    res.json({ file: `${process.env.APP_BASEURL}/files/${response.uuid}` });
  });
});

module.exports = router;
