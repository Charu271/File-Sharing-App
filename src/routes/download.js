const express = require("express");
const router = express.Router();
const File = require("../models/file");
const path = require("path");

router.get("/:uuid", async (req, res) => {
  try {
    console.log("entered");
    const file = await File.findOne({ uuid: req.params.uuid });
    console.log(file);
    if (!file) {
      return res.render("download", {
        error: "File Link has expired.",
      });
    }
    const filePath = path.join(__dirname, `../../${file.path}`);
    console.log(filePath);
    res.download(filePath);
  } catch (e) {
    res.render("download", {
      error: "Something went wrong",
    });
  }
});

module.exports = router;
