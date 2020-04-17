import { createAction, handleActions } from 'redux-actions';
import { fromJS, List } from 'immutable';

const initData = {
  downloadList: []
};

export const setDownloadList = createAction('bilibiliDownload/下载队列');

export default {
  bilibiliDownload: handleActions({
    [setDownloadList]($$state, action) {
      return $$state.set('downloadList', List(action.payload));
    }
  }, fromJS(initData))
};