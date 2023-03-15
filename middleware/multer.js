const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("file");

console.log("multer middleware is running");

module.exports = upload;
