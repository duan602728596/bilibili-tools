import React, { Fragment, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { ButtonGroup, LinkButton, DataGrid, GridColumn } from 'rc-easyui';
import { findIndex } from 'lodash-es';
import loadModels from '../../store/loadModels';
import style from './index.sass';
import BasicPanel from '../../components/BasicPanel/BasicPanel';
import useMessage from '../../components/useMessage/useMessage';
import AddForm from './AddForm';
import DownloadDialog from './DownloadDialog';
import models, { setDownloadList } from './models/models';

/* state */
const state = createStructuredSelector({
  bilibiliDownload: createSelector(
    ({ bilibiliDownload: $$bilibiliDownload }) => $$bilibiliDownload?.get?.('downloadList'),
    (data) => data?.toJS?.() ?? []
  )
});

/* B站视频下载 */
function BilibiliDownload(props) {
  const { bilibiliDownload } = useSelector(state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const addFormRef = useRef(null);
  const [downloadRow, setDownloadRow] = useState(undefined); // 下载
  const [Message, message] = useMessage();

  // 关闭事件回调
  function handleDownloadDialogCloseCallback() {
    setDownloadRow(undefined);
  }

  // 视频下载，获取下载地址
  function handleDownloadGetUrlClick(item) {
    setDownloadRow(item);
  }

  // 添加下载队列
  function handleAddClick() {
    addFormRef.current.dialogRef.current.open();
  }

  // 删除队列
  function handleDeleteClick(item) {
    const { row } = item;

    message.confirm({
      title: '警告',
      msg: '确定要删除吗？',
      result: (r) => {
        if (r) {
          const index = findIndex(bilibiliDownload, (o) => o.id === row.id);

          if (index >= 0) {
            bilibiliDownload.splice(index, 1);
            bilibiliDownload |> setDownloadList |> dispatch;
          }
        }
      }
    });
  }

  // header
  function panelHeaderRender() {
    return (
      <ButtonGroup key="header">
        <LinkButton iconCls="icon-search" onClick={ handleAddClick }>添加下载队列</LinkButton>
        <LinkButton iconCls="icon-undo" onClick={ (event) => navigate('../') }>返回</LinkButton>
      </ButtonGroup>
    );
  }

  // 渲染下载类型
  function downloadTypeRender(item) {
    return <span className={ classNames(style.tag, style[item.value]) }>{ item.value.toLocaleUpperCase() }</span>;
  }

  // 渲染操作菜单
  function handleOperationRender(item) {
    return (
      <div className={ style.tableBtn }>
        <ButtonGroup>
          <LinkButton iconCls="icon-tip" onClick={ () => handleDownloadGetUrlClick(item) }>开始下载</LinkButton>
          <LinkButton iconCls="icon-remove" onClick={ () => handleDeleteClick(item) }>删除</LinkButton>
        </ButtonGroup>
      </div>
    );
  }

  return [
    <Fragment key="panel">
      <BasicPanel header={ panelHeaderRender }>
        <DataGrid data={ bilibiliDownload }>
          <GridColumn field="bid" title="下载ID" />
          <GridColumn field="type" title="下载类型" render={ downloadTypeRender } />
          <GridColumn title="操作" render={ handleOperationRender } />
        </DataGrid>
      </BasicPanel>
      <AddForm ref={ addFormRef } />
      <DownloadDialog downloadRow={ downloadRow } onClose={ handleDownloadDialogCloseCallback } />
    </Fragment>,
    Message
  ];
}

export default loadModels(models)(BilibiliDownload);