import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { QqOutlined as IconQqOutlined } from '@ant-design/icons';
import style from './version.sass';
import { name, version as packageJsonVersion } from '../../../../../package.json';
import useMessage from '../../components/useMessage/useMessage';
import { reqSoftwareVersion } from './models/models';

/* state */
const state = createStructuredSelector({
  version: createSelector(
    ({ index: $$index }) => $$index.get?.('version'),
    (data) => data
  )
});

function Version(props) {
  const { version } = useSelector(state);
  const dispatch = useDispatch();
  const [Message, message] = useMessage();

  // 判断是否需要升级
  async function update() {
    if (version !== undefined) return;

    const res = await dispatch(reqSoftwareVersion());

    if (res && res !== packageJsonVersion) {
      message.alert({
        title: '升级提示',
        icon: 'warning',
        msg: '软件已更新，请下载最新版本。'
      });
    }
  }

  useEffect(function() {
    if (process.env.NODE_ENV !== 'development') {
      update();
    }
  }, []);

  return [
    <footer key="footer" className={ style.footer }>
      <span className={ style.mr }>{ name }</span>
      <span className={ style.mr1 }>v{ packageJsonVersion }</span>
      <span className={ style.mr }>
        <IconQqOutlined />
        602728596
      </span>
      <span>duanhaochen@126.com</span>
    </footer>,
    Message
  ];
}

export default Version;