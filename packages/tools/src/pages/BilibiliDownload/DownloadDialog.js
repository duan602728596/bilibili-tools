import url from 'url';
import path from 'path';
import { remote } from 'electron';
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { Dialog, Form, FormField, ComboBox, LinkButton, Label, TextBox, CheckBox } from 'rc-easyui';
import dayjs from 'dayjs';
import style from './downloadDialog.sass';
import useMessage from '../../components/useMessage/useMessage';
import { requestAudioPlayUrl, requestBilibiliVideo } from './services/services';
import parsingBilibiliVideoUrl from './function/parsingBilibiliVideoUrl';
import BilibiliDownload from './function/BilibiliDownload';
import { setDownloadList, setFfmpegChildList } from './models/models';

/* state */
const state = createStructuredSelector({
  bilibiliDownload: createSelector(
    ({ bilibiliDownload: $$bilibiliDownload }) => $$bilibiliDownload?.get?.('downloadList'),
    (data) => data?.toJS?.() ?? []
  ),
  // ffmpeg下载进程
  ffmpegChildList: createSelector(
    ({ bilibiliDownload: $$bilibiliDownload }) => $$bilibiliDownload?.get?.('ffmpegChildList'),
    (data) => data?.toJS?.() ?? []
  )
});

/* 获取下载的文件名 */
function getVideoUrlExt(videoUrl) {
  if (videoUrl && videoUrl.length > 0) {
    const urlResult = new url.URL(videoUrl[0].value);
    const parseResult = path.parse(urlResult.pathname);

    return parseResult.ext === '.flv' ? 'flv' : 'mp4';
  } else {
    return 'mp4';
  }
}

function DownloadDialog(props) {
  const { bilibiliDownload, ffmpegChildList } = useSelector(state);
  const dispatch = useDispatch();
  const formRef = useRef(null),
    dialogRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState([]), // 视频地址
    [audioUrl, setAudioUrl] = useState([]),     // 音频地址
    [formValue, setFormValue] = useState({ deleteFile: true }), // 表单的值
    [loading, setLoading] = useState(false);    // 加载中
  const [Message, message] = useMessage();

  // 关闭
  function handleDialogClose() {
    dialogRef.current.close();
    props.onClose();
    setFormValue({ deleteFile: true });
  }

  // 表单的change事件
  function handleFormChange(key, value) {
    setFormValue((prevState) => {
      return { ...prevState, [key]: value };
    });
  }

  // 选择保存位置
  async function handleFileSaveClick(event) {
    const row = props.downloadRow;
    const ext = row.type === 'au' ? 'm4a' : getVideoUrlExt(videoUrl);
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
    setLoading(true);

    try {
      const row = props.downloadRow;
      const res = await requestAudioPlayUrl(row.bid);
      const urls = res.data.data.cdns.map((item, index) => ({
        value: item,
        text: `线路${ index + 1 }`
      }));

      setAudioUrl(urls);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  // 获取av地址
  async function getVideoUrl() {
    setLoading(true);

    try {
      const row = props.downloadRow;
      const res = await requestBilibiliVideo(row.type, row.bid, row.page);
      const urlResult = await parsingBilibiliVideoUrl(res.data, row);

      setVideoUrl(urlResult.videoUrl);
      setAudioUrl(urlResult.audioUrl);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  // 获取地址
  function getMediaUrl() {
    if (!props.downloadRow) return;

    dialogRef.current.open();

    const row = props.downloadRow;

    // 下载音频
    if (row.type === 'au') {
      getAuUrl();
    } else if (row.type === 'av' || row.type === 'bv') {
      getVideoUrl();
    }
  }

  // 开始下载
  function handleDownloadVideoClick(event) {
    formRef.current.validate((err) => {
      if (err) return;

      const download = new BilibiliDownload({
        ...formValue,
        row: props.downloadRow
      });

      download.ffmpegInit();
      ffmpegChildList.push(download);
      ffmpegChildList |> setFfmpegChildList |> dispatch;
      bilibiliDownload |> setDownloadList |> dispatch;
      message.alert({ msg: '开始下载。' });
      handleDialogClose();
    });
  }

  // rules
  function formRules() {
    const row = props.downloadRow;
    const rules = { file: ['required'] };

    if (row && row.type === 'au') {
      rules.audioUrl = ['required'];
    } else {
      rules.videoUrl = ['required'];

      if (audioUrl && audioUrl.length > 0) {
        rules.audioUrl = ['required'];
      }
    }

    return rules;
  }

  useEffect(function() {
    getMediaUrl();
  }, [props.downloadRow]);

  return [
    <Dialog key="dialog" ref={ dialogRef } title="视频地址选择" modal={ true } closed={ true }>
      <div className={ style.formBox }>
        <Form ref={ formRef }
          model={ formValue }
          labelWidth={ 80 }
          rules={ formRules() }
          errorType="tooltip"
          onChange={ handleFormChange }
        >
          <Label>下载类型：</Label>
          { props?.downloadRow?.type.toLocaleUpperCase() }
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
          <FormField name="deleteFile" label="下载完毕后删除临时文件：" labelWidth={ 175 }>
            <CheckBox value={ formValue.deleteFile } checked={ formValue.deleteFile } />
          </FormField>
        </Form>
      </div>
      <div className="dialog-button">
        <LinkButton iconCls="icon-cancel" onClick={ handleDialogClose }>关闭</LinkButton>
        <LinkButton iconCls="icon-ok"
          disabled={ loading ? true : undefined }
          onClick={ handleDownloadVideoClick }
        >
          开始下载
        </LinkButton>
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