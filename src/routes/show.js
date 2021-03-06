const express = require("express");
const router = express.Router();
const File = require("../models/file");

router.get("/:uuid", async (req, res) => {
  try {
    const file = await File.findOne({ uuid: req.params.uuid });
    if (!file) {
      return res.render("download", { error: "File Link has been expired." });
    }
    res.render("download", {
      filename: file.filename,
      size: Math.round(file.size / 1000),
      uuid: file.uuid,
      downloadLink: `${process.env.APP_BASEURL}/files/download/${file.uuid}`,
    });
  } catch (e) {
    res.render("download", { error: "Something went wrong." });
  }
});

module.exports = router;
