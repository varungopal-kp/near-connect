const multer = require("multer");
const path = require("path");
const fs = require("fs");

const filePath = "uploads/";

// Helper function to set up multer with a dynamic storage path
const multerInstance = (folderPath) => {
  try {
    // Set up storage engine with Multer
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        fs.mkdirSync(filePath + folderPath, { recursive: true }); // create folder if it doesn't exist
        cb(null, filePath + folderPath); // save images to specified folder
      },
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`); // rename the file
      },
    });

    // File filter to allow only image uploads
    const fileFilter = (req, file, cb) => {
      const allowedFileTypes = /jpeg|jpg|png|gif/;
      const extname = allowedFileTypes.test(
        path.extname(file.originalname).toLowerCase()
      );
      const mimetype = allowedFileTypes.test(file.mimetype);

      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb("Error: Only images are allowed!");
      }
    };

    // Initialize Multer with the configured storage and file filter
    return multer({
      storage: storage,
      fileFilter: fileFilter,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = multerInstance;
