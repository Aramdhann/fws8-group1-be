var multer = require("multer");
// const path = require("path");

const storage = multer.memoryStorage();

// Membuat upload middleware
module.exports = multer({ storage });
