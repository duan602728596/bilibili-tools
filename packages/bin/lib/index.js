"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ffmpegPath = ffmpegPath;
exports.youtubeDlPath = youtubeDlPath;

var _os = _interopRequireDefault(require("os"));

var _path = _interopRequireDefault(require("path"));

var _process = _interopRequireDefault(require("process"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isDev = _process.default.env.NODE_ENV === 'development';

const sys = _os.default.platform();

const dir = _path.default.join(__dirname, '../bin');
/* ffmpeg的地址 */


function ffmpegPath() {
  if (isDev) return 'ffmpeg';

  switch (sys) {
    case 'win32':
      return _path.default.join(dir, 'ffmpeg.exe');

    case 'darwin':
      return _path.default.join(dir, 'ffmpeg');
  }
}
/* youtube-dl的地址 */


function youtubeDlPath() {
  if (isDev) return 'youtube-dl';

  switch (sys) {
    case 'win32':
      return _path.default.join(dir, 'youtube-dl.exe');

    case 'darwin':
      return _path.default.join(dir, 'youtube-dl');
  }
}