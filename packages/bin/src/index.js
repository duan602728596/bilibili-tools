import os from 'os';
import path from 'path';
import process from 'process';

const isDev = process.env.NODE_ENV === 'development';
const sys = os.platform();
const dir = path.join(__dirname, '../bin');

/* ffmpeg的地址 */
export function ffmpegPath() {
  if (isDev) return 'ffmpeg';

  switch (sys) {
    case 'win32':
      return path.join(dir, 'ffmpeg.exe');

    case 'darwin':
      return path.join(dir, 'ffmpeg');
  }
}

/* youtube-dl的地址 */
export function youtubeDlPath() {
  if (isDev) return 'youtube-dl';

  switch (sys) {
    case 'win32':
      return path.join(dir, 'youtube-dl.exe');

    case 'darwin':
      return path.join(dir, 'youtube-dl');
  }
}