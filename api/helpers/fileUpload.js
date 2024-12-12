const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;    // Had issues with path coz of environment
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

const publicFolder = "uploads/";

const rootPath = path.join(__dirname, "..");

// Helper function to set up multer with a dynamic storage path
const multerInstance = (folder) => {
  try {
    // Set up storage engine with Multer
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        fs.mkdirSync(publicFolder + folder, { recursive: true }); // Create folder if it doesn't exist
        cb(null, publicFolder + folder); // Save images to the specified folder
      },
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`); // Rename the file
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
    console.error("Error initializing Multer instance:", error);
  }
};

const multerVideoInstance = (folder) => {
  try {
    // Set up storage engine with Multer
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        fs.mkdirSync(publicFolder + folder, { recursive: true });
        cb(null, publicFolder + folder);
      },
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`); // Rename the file
      },
    });

    // File filter to allow only video uploads
    const fileFilter = (req, file, cb) => {
      const allowedFileTypes = /mp4/;
      const extname = allowedFileTypes.test(
        path.extname(file.originalname).toLowerCase()
      );
      const mimetype = allowedFileTypes.test(file.mimetype);

      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb("Error: Only videos are allowed!");
      }
    };

    // Initialize Multer with the configured storage and file filter
    return multer({
      storage: storage,
      fileFilter: fileFilter,
    });
  } catch (error) {
    console.error("Error initializing Multer instance:", error);
  }
};

// Middleware to resize uploaded photo
const resizePhoto =
  ({ thumb, resize }) =>
  async (req, res, next) => {
    try {
      const destination = req.file.destination;

      let thumbSize = {
        width: 200,
        height: 200,
      };
      if (thumb) thumbSize = thumb;
      let resizeSize = {
        width: 500,
        height: 500,
      };
      if (resize) resizeSize = resize;

      if (!req.file) {
        return next(new Error("No file uploaded"));
      }

      const { path: originalPath, filename } = req.file;

      const thumbnailFolder = path.join(rootPath, destination, "thumbnail");
      const resizedFolder = path.join(rootPath, destination, "resized");

      if (!fs.existsSync(thumbnailFolder)) {
        fs.mkdirSync(thumbnailFolder, { recursive: true }); // Ensure all parent directories are created
      }

      if (!fs.existsSync(resizedFolder)) {
        fs.mkdirSync(resizedFolder, { recursive: true });
      }

      const thumbnailPath = path.join(destination, "thumbnail", filename);
      const resizedPath = path.join(destination, "resized", filename);

      // Resize the image using Sharp
      await sharp(originalPath)
        .resize(resizeSize.width, resizeSize.height)
        .toFile(resizedPath);

      await sharp(originalPath)
        .resize(thumbSize.width, thumbSize.height)
        .toFile(thumbnailPath);

      req.file.thumbnailPath = thumbnailPath;
      req.file.resizedPath = resizedPath;

      // Delete the original file

      // const unlinkPath = path.resolve(req.file.path); // unlink space issue
      // fs.unlink(unlinkPath, (err) => {
      //   //::Issue
      //   if (err) {
      //     console.error("Error deleting file:", err);
      //   }
      // });

      next();
    } catch (error) {
      console.error("Error resizing:", error);
      next(error);
    }
  };

function generateThumbnail(_videoPath, _outputPath, timestamp = "00:00:01") {

  const videoPath = path.join(rootPath, _videoPath);
  const outputPath = path.join(rootPath, _outputPath);

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    console.log("Generating thumbnail...");
    const name = new Date().getTime() + ".png";
    ffmpeg(videoPath)
      .screenshots({
        timestamps: [timestamp], // Time in the video to take the screenshot
        filename:name, // Output filename
        folder: outputPath, // Output directory
        size: "320x240", // Thumbnail size
      })
      .on("end", () => {
        console.log("Thumbnail created successfully");
        resolve(name);
      })
      .on("error", (err) => {
        console.log(err)
        console.error("Error generating thumbnail:", err.message);
        reject(err);
      });
  });
}

module.exports = {
  default: multerInstance,
  resizePhoto,
  multerVideoInstance,
  generateThumbnail,
};
