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
  destination: (req, file, cb) => cb(null, `src/uploads/`),
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
      path: `${req.file.destination}${req.file.filename}`,
      uuid: uuidv4(),
    });
    const response = await file.save();
    res.json({ file: `${process.env.APP_BASEURL}/files/${response.uuid}` });
  });
});

router.post("/send", async (req, res) => {
  try {
    const { emailFrom, emailTo, uuid } = req.body;
    if (!emailFrom || !emailTo || !uuid) {
      return res.status(422).send({ error: "All fields are required" });
    }

    const file = await File.findOne({ uuid });
    if (!file) {
      return res.status(404).send({ error: "Link has expired" });
    }
    if (file.sender) {
      return res.status(422).send({ error: "Email already sent" });
    }
    file.sender = emailFrom;
    file.reciever = emailTo;
    await file.save();
    const sendMail = require("../services/emailSender");
    sendMail({
      sendTo: emailTo,
      sendFrom: emailFrom,
      subject: "File Sharing",
      text: `${emailFrom} shared a file with you`,
      html: require("../services/emailTemplate")({
        emailFrom,
        size: parseInt(file.size / 1000) + " KB",
        expires: "24 hours",
        downloadLink: `${process.env.APP_BASEURL}/files/download/${file.uuid}?source=email`,
      }),
    });
    res.send();
  } catch (e) {
    return res.status(500).send();
  }
});

module.exports = router;
