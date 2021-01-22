const File = require("./models/file.js");
const fs = require("fs");
const deleteFiles = async () => {
  const pastDate = new Date(new Date() - 1000 * 60 * 60 * 24);
  const files = await File.find({ createdAt: { $lt: pastDate } });
  if (files.length > 0) {
    for (const file of files) {
      try {
        //fs.unlinkSync(file.path);
        await file.remove();
        console.log(`${file.name} has been removed`);
      } catch (e) {
        console.log(`An error occured : ${e}`);
      }
    }
  }
  console.log("Jobs done");
};

module.exports = deleteFiles;
