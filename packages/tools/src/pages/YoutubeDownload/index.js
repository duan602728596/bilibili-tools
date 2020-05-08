import React, { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { ButtonGroup, LinkButton, DataGrid, GridColumn } from 'rc-easyui';
import style from './index.sass';
import BasicPanel from '../../components/BasicPanel/BasicPanel';

/* Youtube视频下载 */
function Index(props) {
  const navigate = useNavigate();

  // header
  function panelHeaderRender() {
    return (
      <ButtonGroup key="header">
        <LinkButton iconCls="icon-search">添加下载队列</LinkButton>
        <LinkButton iconCls="icon-undo" onClick={ (event) => navigate('../') }>返回</LinkButton>
      </ButtonGroup>
    );
  }

  // 渲染下载类型
  function downloadTypeRender(item) {
    return (
      <span className={ classNames(style.tag, style[item.value]) }>
        { item.value === 'live' ? '直播' : '视频' }
      </span>
    );
  }

  // 渲染操作菜单
  function handleOperationRender(item) {
    return (
      <div className={ style.tableBtn }>
        <ButtonGroup>
          <LinkButton iconCls="icon-tip">开始下载</LinkButton>
          <LinkButton iconCls="icon-remove">删除</LinkButton>
        </ButtonGroup>
      </div>
    );
  }

  return [
    <Fragment key="panel">
      <BasicPanel header={ panelHeaderRender }>
        <DataGrid>
          <GridColumn field="youtubeId" title="视频ID" />
          <GridColumn field="type" title="类型" render={ downloadTypeRender } />
          <GridColumn title="操作" render={ handleOperationRender } />
        </DataGrid>
      </BasicPanel>
    </Fragment>
  ];
}

export default Index;