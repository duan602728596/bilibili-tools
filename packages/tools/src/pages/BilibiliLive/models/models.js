import { createAction, handleActions } from 'redux-actions';
import { fromJS, List } from 'immutable';
import { db } from '../../../utils/dbInit';
import config from '../../../utils/config';

const { objectStore } = config.indexedDB;
const optionsName = objectStore[0].name;
const initData = {
  bilibiliLiveOptions: [],
  ffmpegChildList: [] // { Array<{ child: object; id: string; }> } ffmpeg下载进程
};

export const saveLiveInfo = db.addAction({ objectStoreName: optionsName }); // 保存数据
export const setBilibiliLiveOptions = createAction('bilibiliLive/数据列表');
export const queryBilibiliLiveOptions = db.cursorAction({ // 请求数据列表
  objectStoreName: optionsName,
  successAction: setBilibiliLiveOptions
});
export const deleteOption = db.deleteAction({ objectStoreName: optionsName });
export const setFffmpegChildList = createAction('bilibiliLive/ffmpeg下载进程');

export default {
  bilibiliLive: handleActions({
    [setBilibiliLiveOptions]($$state, action) {
      return $$state.set('bilibiliLiveOptions', List(action.payload.result));
    },
    [setFffmpegChildList]($$state, action) {
      return $$state.set('ffmpegChildList', List(action.payload));
    }
  }, fromJS(initData))
};