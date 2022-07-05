const multer = require("multer");
const path = require("path");

// Menentukan tempat penyimpanan file
const Directory = path.join(__dirname, "../public/uploads");

// Mendefinisikan gimana cara nyimpen file-nya
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, Directory);
  },

  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const maxSize = 1 * 12024 * 1024;

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if(
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg, and .jpeg format allowed"));
    }
  },
  limits: {fileSize: maxSize},
}).single('file');

// Membuat upload middleware
module.exports = multer({ upload });

//https://codingshiksha.com/javascript/node-js-multer-file-upload-type-validation-filters-and-limit-file-size-and-error-handling-using-express-full-tutorial-for-beginners-with-examples/