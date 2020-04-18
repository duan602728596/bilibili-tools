import childProcess from 'child_process';
import { findIndex } from 'lodash-es';
import { ffmpeg } from '../../../utils/utils';
import store from '../../../store/store';
import { setDownloadList, setFfmpegChildList } from '../models/models';
import { requestDownloadMedia } from '../services/services';

/* 视频下载 */
class BilibiliDownload {
  constructor({ videoUrl, audioUrl, file, row }) {
    this.videoUrl = videoUrl;
    this.audioUrl = audioUrl;
    this.file = file;
    this.row = row;
    this.child = undefined; // 合并的ffmpeg
    this.audioRequest = undefined; // 下载音频
    this.videoRequest = undefined; // 下载视频
  }

  // 结束
  ffmpegEnd() {
    const state = store.getState();
    const { bilibiliDownload: $$bilibiliDownload } = state;
    const ffmpegChildList = $$bilibiliDownload.get('ffmpegChildList').toJS();
    const downloadList = $$bilibiliDownload.get('downloadList').toJS();
    const index = findIndex(ffmpegChildList, (o) => o.row.id === this.row.id);

    ffmpegChildList.splice(index, 1);
    ffmpegChildList |> setFfmpegChildList |> store.dispatch;
    downloadList |> setDownloadList |> store.dispatch;
  }

  handleChildProcessStdout = (data) => {
    console.log(data.toString());
  };

  handleChildProcessStderr = (data) => {
    console.log(data.toString());
  };

  handleChildProcessExit = (code, data) => {
    console.log(code, data);
    this.ffmpegEnd();
  };

  handleChildProcessError = (err) => {
    console.error(err);
    this.ffmpegEnd();
  };

  async ffmpegAudioInit() {
    this.audioRequest = await requestDownloadMedia(this.file, this.audioUrl, this.row.type, this.row.bid);
    this.ffmpegEnd();
  }

  ffmpegInit() {
    // 下载音频
    if (this.row.type === 'au') {
      this.ffmpegAudioInit();

      return;
    }
  }
}

export default BilibiliDownload;