import url from 'url';
import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, FormField, TextBox, LinkButton, ButtonGroup, Panel, Label } from 'rc-easyui';
import style from './options.sass';
import useMessage from '../../components/useMessage/useMessage';
import iconStyle from '../../components/icons/icons.sass';
import Main from '../../components/Main/Main';
import { randomId } from '../../utils/utils';
import { saveLiveInfo } from './models/models';
import { requestRoomInfo } from './services/services';

/* 添加配置 */
function Options(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [formValue, setFormValue] = useState({}), // 表单的值
    [liveUrl, setLiveUrl] = useState(''),         // 直播间地址
    [realId, setRealId] = useState('');           // 查询的真实id
  const [Message, message] = useMessage();

  // 保存
  function handleSaveClick() {
    formRef.current.validate(async (err) => {
      if (err) return;

      const id = randomId(30);

      await dispatch(saveLiveInfo({ data: { id, ...formValue } }));
      message.alert({ msg: '保存成功！' });
      setFormValue({});
    });
  }

  // 获取直播间id
  async function handleGetRoomIdClick() {
    try {
      const urlParseResult = new url.URL(liveUrl);

      if (urlParseResult.host !== 'live.bilibili.com') {
        message.alert({
          icon: 'warning',
          title: '直播间地址错误',
          msg: '直播间地址错误！请输入有效的bilibili直播间地址。'
        });

        return;
      }

      const urlArr = liveUrl.split(/\//g),
        id = urlArr[urlArr.length - 1];
      const res = await requestRoomInfo(id);

      setRealId(res.data.data.room_id.toString());
    } catch (err) {
      message.alert({
        icon: 'error',
        title: '直播间地址错误',
        msg: '获取直播间ID错误！'
      });
    }
  }

  // 添加到直播间
  function handleSetLiveIdClick() {
    setFormValue((prevState) => {
      return { ...prevState, liveId: realId };
    });
  }

  // 表单的change事件
  function handleFormChange(key, value) {
    setFormValue((prevState) => {
      return { ...prevState, [key]: value };
    });
  }

  // footer
  function formPanelFooterRender() {
    return (
      <div className={ style.btnGroup }>
        <ButtonGroup key="footer">
          <LinkButton iconCls="icon-save" onClick={ handleSaveClick }>保存</LinkButton>
          <LinkButton iconCls="icon-undo" onClick={ () => navigate('../') }>返回</LinkButton>
        </ButtonGroup>
      </div>
    );
  }

  return [
    <Main key="main" className={ style.main }>
      {/* 添加直播间的信息 */}
      <Panel className={ style.space } title="添加直播间信息" footer={ formPanelFooterRender } collapsible={ true }>
        <div className={ style.panelBox }>
          <Form ref={ formRef }
            model={ formValue }
            labelWidth={ 90 }
            rules={{
              liveId: ['required'],
              liveName: ['required']
            }}
            errorType="tooltip"
            onChange={ handleFormChange }
          >
            <FormField name="liveId" label="直播间ID：">
              <TextBox value={ formValue.liveId } />
            </FormField>
            <FormField name="liveName" label="直播间名称：">
              <TextBox value={ formValue.liveName } />
            </FormField>
          </Form>
        </div>
      </Panel>
      {/* 获取直播间的真实ID */}
      <Panel title="获取直播间ID" collapsible={ true }>
        <div className={ style.panelBox }>
          <p className={ style.desc }>
            B站某些直播间的ID不是真实ID（例如：https://live.bilibili.com/48）。
            查找并添加直播间的真实ID。
          </p>
          <div>
            <Label className={ style.label } htmlFor="bilibili-live-url">直播间地址：</Label>
            <TextBox className={ style.liveUrlInput }
              inputId="bilibili-live-url"
              placeholder="输入直播间的完整地址"
              value={ liveUrl }
              onChange={ (value) => setLiveUrl(value) }
            />
            <LinkButton className={ style.spaceBtn }
              iconCls="icon-search"
              onClick={ handleGetRoomIdClick }
            >
              获取ID
            </LinkButton>
          </div>
          <p>
            当前直播间地址的真实ID为：
            <TextBox value={ realId } readOnly={ true } />
            <LinkButton className={ style.spaceBtn }
              iconCls={ iconStyle.copy }
              onClick={ handleSetLiveIdClick }
            >
              添加到直播间ID
            </LinkButton>
          </p>
        </div>
      </Panel>
    </Main>,
    Message
  ];
}

export default Options;