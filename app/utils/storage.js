const multer  = require('multer');
const path  = require('path');

var avatars = multer({
  storage: multer.diskStorage({
    destination: path.join(__dirname, '..', '..', 'storage', 'cdn', 'avatars'),
    filename: function(req, file, cb) {
      var ext = (/[.]/.exec(file.originalname)) ? /[^.]+$/.exec(file.originalname)[0] : 'noext';
      cb(null, 'image_' + Date.now() + '.' + ext);
    }
  })
});

var screenshots = multer({
  storage: multer.diskStorage({
    destination: path.join(__dirname, '..', '..', 'storage', 'cdn', 'reports'),
    filename: function(req, file, cb) {
      var ext = (/[.]/.exec(file.originalname)) ? /[^.]+$/.exec(file.originalname)[0] : 'noext';
      cb(null, 'scrsht_' + Date.now() + '.' + ext);
    }
  })
});

module.exports = { avatars, screenshots };