const express = require("express");
const router = express.Router();

const {
  authenticateRequest,
  checkUserRole,
} = require("../middleware/middleware");

const uploadFile = require("../awsS3");
const upload = require("../middleware/multer");

router.post("/uploadImage", upload, (req, res) => {
  const file = req.file;
  console.log("hello i am from upload image api!");
  console.log(file);

  if (!file) {
    res.status(400).json({ error: "No files were Found!!" });
  } else {
    uploadFile(file).then(function (result) {
      console.log(result);
      res.send(result);
    });
  }
});

module.exports = router;
