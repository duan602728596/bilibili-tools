import { remote } from 'electron';
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { Dialog, Form, FormField, ComboBox, LinkButton, Label, TextBox } from 'rc-easyui';
import dayjs from 'dayjs';
import style from './downloadDialog.sass';
import useMessage from '../../components/useMessage/useMessage';
import { requestAudioPlayUrl } from './services/services';

function DownloadDialog(props) {
  const dispatch = useDispatch();
  const formRef = useRef(null),
    dialogRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState([]), // 视频地址
    [audioUrl, setAudioUrl] = useState([]),     // 音频地址
    [formValue, setFormValue] = useState({});   // 表单的值
  const [Message, message] = useMessage();

  // 关闭
  function handleDialogClose() {
    dialogRef.current.close();
    props.onClose();
    setFormValue({});
  }

  // 表单的change事件
  function handleFormChange(key, value) {
    setFormValue((prevState) => {
      return { ...prevState, [key]: value };
    });
  }

  // 选择保存位置
  async function handleFileSaveClick(event) {
    const { row } = props.downloadRow;
    const ext = row.type === 'au' ? 'm4a' : 'mp4';
    const time = dayjs().format('YYYY.MM.DD.HH.mm.ss');
    const result = await remote.dialog.showSaveDialog({
      defaultPath: `${ row.type }${ row.bid }_${ time }.${ ext }`,
      properties: ['openFile']
    });

    if (!result.canceled) {
      handleFormChange('file', result.filePath);
    }
  }

  // 获取音频地址
  async function getAuUrl() {
    const { row } = props.downloadRow;
    const res = await requestAudioPlayUrl(row.bid);
    const urls = res.data.data.cdns.map((item, index) => ({
      value: item,
      text: `线路${ index + 1 }`
    }));

    setAudioUrl(urls);
  }

  // 获取地址
  function getVideoUrl() {
    if (!props.downloadRow) return;

    dialogRef.current.open();

    const { row } = props.downloadRow;

    // 下载音频
    if (row.type === 'au') {
      getAuUrl();
    }
  }

  // rules
  function formRules() {
    const row = props.downloadRow?.row;
    const rules = { file: ['required'] };

    if (row && row.type === 'au') {
      rules.audioUrl = ['required'];
    } else {
      rules.videoUrl = ['required'];

      if (audioUrl.length >= 0) {
        rules.audioUrl = ['required'];
      }
    }

    return rules;
  }

  useEffect(function() {
    getVideoUrl();
  }, [props.downloadRow]);

  return [
    <Dialog key="dialog" ref={ dialogRef } title="视频地址选择" modal={ true } closed={ true }>
      <div className={ style.formBox }>
        <Form ref={ formRef }
          model={ formValue }
          labelWidth={ 80 }
          rules={ formRules() }
          onChange={ handleFormChange }
        >
          <Label>下载类型：</Label>
          { props?.downloadRow?.row.type.toLocaleUpperCase() }
          <FormField name="videoUrl" label="视频地址：">
            <ComboBox value={ formValue.videoUrl } data={ videoUrl } />
          </FormField>
          <FormField name="audioUrl" label="音频地址：">
            <ComboBox value={ formValue.audioUrl } data={ audioUrl } />
          </FormField>
          <FormField name="file" label="保存位置：">
            <TextBox value={ formValue.file }
              readOnly={ true }
              addonRight={ () => <LinkButton onClick={ handleFileSaveClick }>选择</LinkButton> }
            />
          </FormField>
        </Form>
      </div>
      <div className="dialog-button">
        <LinkButton iconCls="icon-cancel" onClick={ handleDialogClose }>关闭</LinkButton>
        <LinkButton iconCls="icon-ok">开始录制</LinkButton>
      </div>
    </Dialog>,
    Message
  ];
}

DownloadDialog.propTypes = {
  downloadRow: PropTypes.object,
  onClose: PropTypes.func
};

export default DownloadDialog;