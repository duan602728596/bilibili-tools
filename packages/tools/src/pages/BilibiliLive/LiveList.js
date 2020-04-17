import React, { Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { useNavigate } from 'react-router-dom';
import { LinkButton, ButtonGroup, DataGrid, GridColumn } from 'rc-easyui';
import { findIndex } from 'lodash-es';
import style from './liveList.sass';
import useMessage from '../../components/useMessage/useMessage';
import BasicPanel from '../../components/BasicPanel/BasicPanel';
import iconStyle from '../../components/icons/icons.sass';
import DialogForm from './DialogForm';
import { queryBilibiliLiveOptions, setBilibiliLiveOptions, deleteOption } from './models/models';
import { requestRoomInfo } from './services/services';

/* state */
const state = createStructuredSelector({
  bilibiliLiveOptions: createSelector(
    ({ bilibiliLive: $$bilibiliLive }) => $$bilibiliLive?.get?.('bilibiliLiveOptions'),
    ($$data) => $$data?.toJS?.() ?? []
  ),
  ffmpegChildList: createSelector(
    ({ bilibiliLive: $$bilibiliLive }) => $$bilibiliLive?.get?.('ffmpegChildList'),
    ($$data) => $$data?.toJS?.() ?? []
  )
});

function LiveList(props) {
  const { bilibiliLiveOptions, ffmpegChildList } = useSelector(state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [playRow, setPlayRow] = useState(undefined);
  const [Message, message] = useMessage();

  // 关闭事件回调
  function handleDialogFormCloseCallback() {
    setPlayRow(undefined);
  }

  // 停止下载
  function handleStopClick(item) {
    message.confirm({
      msg: '确定要停止录制吗？',
      result: (r) => {
        if (r) {
          const index = findIndex(ffmpegChildList, (o) => o.row.id === item.row.id);

          ffmpegChildList[index].child.kill();
        }
      }
    });
  }

  // 开始下载
  async function handleDownloadClick(item) {
    const { row } = item;
    const res = await requestRoomInfo(row.liveId);

    if (res.data.data.live_status !== 1) {
      message.alert({
        msg: '当前直播未开始。'
      });

      return;
    }

    setPlayRow(row);
  }

  // 从数据库删除数据
  function handleDeleteOptionClick(item) {
    const { row } = item;

    message.confirm({
      title: '警告',
      msg: '确定要删除吗？',
      result: async (r) => {
        if (r) {
          await dispatch(deleteOption({ query: row.id }));

          const index = findIndex(bilibiliLiveOptions, (o) => o.id === row.id);

          if (index >= 0) {
            bilibiliLiveOptions.splice(index, 1);
            ({ result: bilibiliLiveOptions }) |> setBilibiliLiveOptions |> dispatch;
          }
        }
      }
    });
  }

  // header
  function panelHeaderRender() {
    return (
      <ButtonGroup key="header">
        <LinkButton className={ iconStyle.smallIcon }
          iconCls="icon-large-shapes"
          onClick={ (event) => navigate('Options') }
        >
          添加监听直播间
        </LinkButton>
        <LinkButton iconCls="icon-undo" onClick={ (event) => navigate('../') }>返回</LinkButton>
      </ButtonGroup>
    );
  }

  // 渲染操作菜单
  function handleOperationRender(item) {
    const index = findIndex(ffmpegChildList, (o) => o.row.id === item.row.id);
    const inLive = index >= 0;

    return (
      <div className={ style.tableBtn }>
        <ButtonGroup>
          {
            inLive
              ? <LinkButton iconCls="icon-no" onClick={ () => handleStopClick(item) }>停止录制</LinkButton>
              : <LinkButton iconCls="icon-tip" onClick={ () => handleDownloadClick(item) }>开始录制</LinkButton>
          }
          <LinkButton iconCls="icon-remove" onClick={ () => handleDeleteOptionClick(item) }>删除</LinkButton>
        </ButtonGroup>
      </div>
    );
  }

  useEffect(function() {
    ({ query: { indexName: 'liveId' } }) |> queryBilibiliLiveOptions |> dispatch;
  }, []);

  return [
    <Fragment key="panel" >
      <BasicPanel header={ panelHeaderRender }>
        <DataGrid data={ bilibiliLiveOptions }>
          <GridColumn field="liveName" title="直播间名称" />
          <GridColumn field="liveId" title="直播间ID" />
          <GridColumn title="操作" render={ handleOperationRender } />
        </DataGrid>
      </BasicPanel>
      <DialogForm playRow={ playRow } onClose={ handleDialogFormCloseCallback } />,
    </Fragment>,
    Message
  ];
}

export default LiveList;