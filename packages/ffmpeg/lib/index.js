"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _os = _interopRequireDefault(require("os"));

var _path = _interopRequireDefault(require("path"));

var _process = _interopRequireDefault(require("process"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isDev = _process.default.env.NODE_ENV === 'development';

function ffmpegPath() {
  if (isDev) {
    return null;
  }

  const sys = _os.default.platform();

  const dir = _path.default.join(__dirname, '../ffmpeg');

  switch (sys) {
    case 'win32':
      return _path.default.join(dir, 'ffmpeg.exe');

    case 'darwin':
      return _path.default.join(dir, 'ffmpeg');
  }
}

var _default = ffmpegPath;
exports.default = _default;