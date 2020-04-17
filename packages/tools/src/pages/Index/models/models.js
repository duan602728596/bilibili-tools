import { createAction, handleActions } from 'redux-actions';
import { fromJS, Map as ImmutableMap } from 'immutable';
import createAsyncAction from '../../../store/createAsyncAction';
import request from '../../../utils/request';

const initData = {
  version: undefined // 请求的版本号
};

export const setSoftwareVersion = createAction('index/软件版本号');
export const reqSoftwareVersion = createAsyncAction(async function(_) {
  try {
    const res = await request('https://raw.githubusercontent.com/duan602728596/bilibili-tools/master/package.json');
    const { version } = res.data;

    await _.put(setSoftwareVersion(version));

    return version;
  } catch (err) {
    console.error(err);
  }
});

/* reducer */
export default {
  index: handleActions({
    [setSoftwareVersion]($$state, action) {
      return $$state.set('version', action.payload);
    }
  }, fromJS(initData))
};