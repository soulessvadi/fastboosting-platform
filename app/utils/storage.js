const multer  = require('multer');
const path  = require('path');
const sharp = require('sharp');

var spaces = {
  avatars: path.join(__dirname, '..', '..', 'storage', 'cdn', 'avatars', path.sep),
  reports: path.join(__dirname, '..', '..', 'storage', 'cdn', 'reports', path.sep),
  shared: path.join(__dirname, '..', '..', 'storage', 'cdn', 'shared', path.sep),
  locales: path.join(__dirname, '..', 'controllers', 'i18n', path.sep),
};

var shared = multer({
  storage: multer.diskStorage({
    destination: spaces.shared,
    filename: function(req, file, cb) {
      var ext = (/[.]/.exec(file.originalname)) ? /[^.]+$/.exec(file.originalname)[0] : 'noext';
      cb(null, 'share_' + Date.now() + '.' + ext);
    }
  })
});

var avatars = multer({
  storage: multer.diskStorage({
    destination: spaces.avatars,
    filename: function(req, file, cb) {
      var ext = (/[.]/.exec(file.originalname)) ? /[^.]+$/.exec(file.originalname)[0] : 'noext';
      cb(null, 'usr_' + Date.now() + '.' + ext);
    }
  })
});

var screenshots = multer({
  storage: multer.diskStorage({
    destination: spaces.reports,
    filename: function(req, file, cb) {
      var ext = (/[.]/.exec(file.originalname)) ? /[^.]+$/.exec(file.originalname)[0] : 'noext';
      cb(null, 'scrsht_' + Date.now() + '.' + ext);
    }
  })
});

module.exports = { spaces, shared, avatars, screenshots };