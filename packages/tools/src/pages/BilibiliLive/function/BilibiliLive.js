import childProcess from 'child_process';
import path from 'path';
import { findIndex } from 'lodash-es';
import { ffmpeg } from '../../../utils/utils';
import store from '../../../store/store';
import { setFffmpegChildList, setBilibiliLiveOptions } from '../models/models';

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko)'
  + ' Chrome/77.0.3865.90 Safari/537.36';

/* 直播录制 */
class BilibiliLive {
  constructor({ playUrl, file, reset, row }) {
    this.playUrl = playUrl;
    this.file = file;
    this.reset = reset;
    this.resetIndex = 0; // 重新下载的编号
    this.row = row;
    this.child = undefined;
  }

  // 获取文件名
  getFile() {
    const { dir, name, ext } = path.parse(this.file);
    let file = '';

    if (this.resetIndex === 0) {
      file = path.join(dir, `${ name }${ ext }`);
    } else {
      file = path.join(dir, `${ name }_${ this.resetIndex }${ ext }`);
    }

    this.resetIndex++;

    return file;
  }

  // 结束
  ffmpegEnd() {
    const state = store.getState();
    const { bilibiliLive: $$bilibiliLive } = state;
    const ffmpegChildList = $$bilibiliLive.get('ffmpegChildList').toJS();
    const bilibiliLiveOptions = $$bilibiliLive.get('bilibiliLiveOptions').toJS();
    const index = findIndex(ffmpegChildList, (o) => o.row.id === this.row.id);

    ffmpegChildList.splice(index, 1);
    ffmpegChildList |> setFffmpegChildList |> store.dispatch;
    ({ result: bilibiliLiveOptions }) |> setBilibiliLiveOptions |> store.dispatch;
  }

  handleChildProcessStdout = (data) => {
    // console.log(data.toString());
  };

  handleChildProcessStderr = (data) => {
    // console.log(data.toString());
  };

  handleChildProcessExit = (code, data) => {
    // console.log(code, data);
    this.ffmpegEnd();
  };

  handleChildProcessError = (err) => {
    console.error(err);

    if (this.reset) {
      this.ffmpegInit();
    } else {
      this.ffmpegEnd();
    }
  };

  // 初始化ffmpeg
  ffmpegInit() {
    const file = this.getFile();

    this.child = childProcess.spawn(ffmpeg, [
      '-user_agent',
      UA,
      '-i',
      this.playUrl,
      '-c',
      'copy',
      file
    ]);

    this.child.stdout.on('data', this.handleChildProcessStdout);
    this.child.stderr.on('data', this.handleChildProcessStderr);
    this.child.on('close', this.handleChildProcessExit);
    this.child.on('error', this.handleChildProcessError);
  }
}

export default BilibiliLive;