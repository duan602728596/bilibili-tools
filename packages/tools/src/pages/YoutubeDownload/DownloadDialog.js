import { remote } from 'electron';
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Dialog, Form, FormField, ComboBox, LinkButton, TextBox, CheckBox } from 'rc-easyui';
import style from './downloadDialog.sass';
import { requestYoutubeHtml } from './services/services';

function DownloadDialog(props) {
  const formRef = useRef(null),
    dialogRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState([]), // 视频地址
    [audioUrl, setAudioUrl] = useState([]),     // 音频地址
    [formValue, setFormValue] = useState({ deleteFile: true }), // 表单的值
    [loading, setLoading] = useState(false);    // 加载中

  // 获取地址
  async function getMediaUrl() {
    setLoading(true);

    try {
      if (!props.downloadRow) return;

      dialogRef.current.open();

      const row = props.downloadRow;
      const res = await requestYoutubeHtml(row.youtubeId);

      console.log(res.data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  // 表单的change事件
  function handleFormChange(key, value) {
    setFormValue((prevState) => {
      return { ...prevState, [key]: value };
    });
  }

  // 关闭
  function handleDialogClose() {
    dialogRef.current.close();
    props.onClose();
    setFormValue({ deleteFile: true });
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
          rules={{ videoUrl: ['required'], audioUrl: ['required'] }}
          errorType="tooltip"
          onChange={ handleFormChange }
        >
          <FormField name="videoUrl" label="视频地址：">
            <ComboBox value={ formValue.videoUrl } data={ videoUrl } />
          </FormField>
          <FormField name="audioUrl" label="音频地址：">
            <ComboBox value={ formValue.audioUrl } data={ audioUrl } />
          </FormField>
          <FormField name="file" label="保存位置：">
            <TextBox value={ formValue.file }
              readOnly={ true }
              addonRight={ () => <LinkButton>选择</LinkButton> }
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
        >
          开始下载
        </LinkButton>
      </div>
    </Dialog>
  ];
}

DownloadDialog.propTypes = {
  downloadRow: PropTypes.object,
  onClose: PropTypes.func
};

export default DownloadDialog;