import { createAction, handleActions } from 'redux-actions';
import { fromJS, List } from 'immutable';

const initData = {
  downloadList: [],
  ffmpegChildList: [] // { Array<{ child: object; id: string; }> } ffmpeg下载进程
};

export const setDownloadList = createAction('bilibiliDownload/下载队列');
export const setFfmpegChildList = createAction('bilibiliDownload/ffmpeg下载进程');

export default {
  bilibiliDownload: handleActions({
    [setDownloadList]($$state, action) {
      return $$state.set('downloadList', List(action.payload));
    },
    [setFfmpegChildList]($$state, action) {
      return $$state.set('ffmpegChildList', List(action.payload));
    }
  }, fromJS(initData))
};