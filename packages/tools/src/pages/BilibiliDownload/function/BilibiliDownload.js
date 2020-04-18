import childProcess from 'child_process';
import fs from 'fs';
import { findIndex } from 'lodash-es';
import { ffmpeg } from '../../../utils/utils';
import store from '../../../store/store';
import { setDownloadList, setFfmpegChildList } from '../models/models';
import { requestDownloadMedia } from '../services/services';

/* 视频下载 */
class BilibiliDownload {
  constructor({ videoUrl, audioUrl, file, deleteFile, row }) {
    this.videoUrl = videoUrl;
    this.audioUrl = audioUrl;
    this.file = file;
    this.deleteFile = deleteFile;
    this.row = row;
    this.child = undefined; // 合并的ffmpeg
  }

  // 结束
  async ffmpegEnd() {
    const state = store.getState();
    const { bilibiliDownload: $$bilibiliDownload } = state;
    const ffmpegChildList = $$bilibiliDownload.get('ffmpegChildList').toJS();
    const downloadList = $$bilibiliDownload.get('downloadList').toJS();
    const index = findIndex(ffmpegChildList, (o) => o.row.id === this.row.id);

    // 删除临时文件
    if (this.videoUrl && this.audioUrl && this.deleteFile) {
      const videoFile = `${ this.file }.video.m4s`,
        audioFile = `${ this.file }.audio.m4s`;
      
      await Promise.all([
        fs.promises.unlink(videoFile),
        fs.promises.unlink(audioFile)
      ]);
    }

    ffmpegChildList.splice(index, 1);
    ffmpegChildList |> setFfmpegChildList |> store.dispatch;
    downloadList |> setDownloadList |> store.dispatch;
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
    // console.error(err);
    this.ffmpegEnd();
  };

  async ffmpegDownloadTemporaryFiles() {
    try {
      const videoFile = `${ this.file }.video.m4s`,
        audioFile = `${ this.file }.audio.m4s`;

      // 先下载临时文件
      await Promise.all([
        requestDownloadMedia(
          videoFile,
          this.videoUrl,
          'bv',
          this.row.bid
        ),
        requestDownloadMedia(
          audioFile,
          this.audioUrl,
          'au',
          this.row.bid
        )
      ]);

      this.child = childProcess.spawn(ffmpeg, [
        '-i',
        videoFile,
        '-i',
        audioFile,
        this.file
      ]);

      this.child.stdout.on('data', this.handleChildProcessStdout);
      this.child.stderr.on('data', this.handleChildProcessStderr);
      this.child.on('close', this.handleChildProcessExit);
      this.child.on('error', this.handleChildProcessError);

      // 重新渲染列表
      const state = store.getState();
      const { bilibiliDownload: $$bilibiliDownload } = state;
      const downloadList = $$bilibiliDownload.get('downloadList').toJS();

      downloadList |> setDownloadList |> store.dispatch;
    } catch (err) {
      console.error(err);
      this.ffmpegEnd();
    }
  }

  async ffmpegDownload() {
    try {
      await requestDownloadMedia(
        this.file,
        this.row.type === 'au' ? this.audioUrl : this.videoUrl,
        this.row.type,
        this.row.bid
      );
    } catch (err) {
      console.error(err);
    }

    this.ffmpegEnd();
  }

  ffmpegInit() {
    if (this.videoUrl && this.audioUrl) {
      this.ffmpegDownloadTemporaryFiles();
    } else {
      this.ffmpegDownload();
    }
  }
}

export default BilibiliDownload;