import os from 'os';
import path from 'path';
import process from 'process';

const isDev = process.env.NODE_ENV === 'development';

function ffmpegPath() {
  if (isDev) {
    return null;
  }

  const sys = os.platform();
  const dir = path.join(__dirname, '../ffmpeg');

  switch (sys) {
    case 'win32':
      return path.join(dir, 'ffmpeg.exe');

    case 'darwin':
      return path.join(dir, 'ffmpeg');
  }
}

export default ffmpegPath;