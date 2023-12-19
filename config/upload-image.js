const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: "df99dizaf",
  api_key: "947312511263424",
  api_secret: "QyHRhqRSnyEFQMIJ7bUjVFPvQcg",
});

function streamUpload(req) {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  });
}

async function upload(req) {
  try {
    let result = await streamUpload(req);
    return result;
  } catch (e) {
    throw e;
  }
}

module.exports = {
  upload,
};
