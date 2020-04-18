import { remote } from 'electron';
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { Dialog, Form, FormField, ComboBox, LinkButton, TextBox, CheckBox } from 'rc-easyui';
import dayjs from 'dayjs';
import style from './dialogForm.sass';
import useMessage from '../../components/useMessage/useMessage';
import BilibiliLive from './function/BilibiliLive';
import { requestRoomPlayUrl } from './services/services';
import { setBilibiliLiveOptions, setFfmpegChildList } from './models/models';

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

/* 选择录制的线路 */
function DialogForm(props) {
  const { bilibiliLiveOptions, ffmpegChildList } = useSelector(state);
  const dispatch = useDispatch();
  const formRef = useRef(null),
    dialogRef = useRef(null);
  const [playUrl, setPlayUrl] = useState([]), // 直播线路
    [formValue, setFormValue] = useState({}), // 表单的值
    [loading, setLoading] = useState(false);  // 加载中
  const [Message, message] = useMessage();

  // 获取播放信息
  async function getPlayUrl() {
    if (!props.playRow) return;

    dialogRef.current.open();
    setLoading(true);

    const res = await requestRoomPlayUrl(props.playRow.liveId);
    const urls = res.data.data.durl.map((item, index) => ({
      value: item.url,
      text: `地址${ index + 1 }`
    }));

    setPlayUrl(urls);
    setLoading(false);
  }

  // 表单的change事件
  function handleFormChange(key, value) {
    setFormValue((prevState) => {
      return { ...prevState, [key]: value };
    });
  }

  // 选择保存位置
  async function handleFileSaveClick(event) {
    const time = dayjs().format('YYYY.MM.DD.HH.mm.ss');
    const result = await remote.dialog.showSaveDialog({
      defaultPath: `${ props.playRow.liveName }_${ time }.flv`,
      properties: ['openFile']
    });

    if (!result.canceled) {
      handleFormChange('file', result.filePath);
    }
  }

  // 关闭
  function handleDialogClose() {
    dialogRef.current.close();
    props.onClose();
    setFormValue({});
  }

  // 开始录制
  function handleRecordClick() {
    formRef.current.validate((err) => {
      if (err) return;

      const live = new BilibiliLive({
        ...formValue,
        row: props.playRow
      });

      live.ffmpegInit();
      ffmpegChildList.push(live);
      ffmpegChildList |> setFfmpegChildList |> dispatch;
      ({ result: bilibiliLiveOptions }) |> setBilibiliLiveOptions |> dispatch;
      message.alert({ msg: '开始录制。' });
      handleDialogClose();
    });
  }

  useEffect(function() {
    getPlayUrl();
  }, [props.playRow]);

  return [
    <Dialog key="dialog" ref={ dialogRef } title="选择录制线路" modal={ true } closed={ true }>
      <div className={ style.formBox }>
        <Form ref={ formRef }
          model={ formValue }
          labelWidth={ 80 }
          rules={{
            playUrl: ['required'],
            file: ['required']
          }}
          errorType="tooltip"
          onChange={ handleFormChange }
        >
          <FormField name="playUrl" label="直播线路：">
            <ComboBox value={ formValue.playUrl } data={ playUrl } />
          </FormField>
          <FormField name="file" label="保存位置：">
            <TextBox value={ formValue.file }
              readOnly={ true }
              addonRight={ () => <LinkButton onClick={ handleFileSaveClick }>选择</LinkButton> }
            />
          </FormField>
          <FormField name="reset" label="错误时重新下载：" labelWidth={ 120 }>
            <CheckBox value={ formValue.reset } />
          </FormField>
        </Form>
      </div>
      <div className="dialog-button">
        <LinkButton iconCls="icon-cancel" onClick={ handleDialogClose }>关闭</LinkButton>
        <LinkButton iconCls="icon-ok"
          disabled={ loading ? true : undefined }
          onClick={ handleRecordClick }
        >
          开始录制
        </LinkButton>
      </div>
    </Dialog>,
    Message
  ];
}

DialogForm.propTypes = {
  playRow: PropTypes.object,
  onClose: PropTypes.func
};

export default DialogForm;