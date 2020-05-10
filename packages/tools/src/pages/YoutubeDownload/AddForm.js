import React, { forwardRef, useState, useRef, useImperativeHandle } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { Dialog, Form, FormField, TextBox, ComboBox, LinkButton } from 'rc-easyui';
import style from './addForm.sass';
import { randomId } from '../../utils/utils';
import { setDownloadList } from './models/models';

/* state */
const state = createStructuredSelector({
  // 下载列表
  downloadList: createSelector(
    ({ youtubeDownload: $$youtubeDownload }) => $$youtubeDownload?.get?.('downloadList'),
    (data) => data?.toJS?.() ?? []
  )
});

const AddForm = forwardRef(function(props, ref) {
  const { downloadList } = useSelector(state);
  const dispatch = useDispatch();
  const formRef = useRef(null),
    dialogRef = useRef(null);
  const [formValue, setFormValue] = useState({
    youtubeId: undefined, // youtube的视频id
    type: 'video'         // 类型，video 视频，live 直播
  }); // 表单的值

  // 表单的change事件
  function handleFormChange(key, value) {
    setFormValue((prevState) => {
      return { ...prevState, [key]: value };
    });
  }

  // 关闭
  function handleCloseClick() {
    dialogRef.current.close();
    setFormValue((prevState) => {
      return {
        youtubeId: undefined,
        type: 'video'
      };
    });
  }

  // 添加到队列
  function handleAddClick() {
    formRef.current.validate((err) => {
      if (err) return;

      const id = randomId(30);

      downloadList.push({ id, ...formValue });
      downloadList |> setDownloadList |> dispatch;
      handleCloseClick();
    });
  }

  useImperativeHandle(ref, () => ({ dialogRef }), []);

  return (
    <Dialog ref={ dialogRef } title="添加下载队列" modal={ true } closed={ true }>
      <div className={ style.formBox }>
        <Form ref={ formRef }
          model={ formValue }
          labelWidth={ 80 }
          rules={{ youtubeId: ['required'], type: ['required'] }}
          errorType="tooltip"
          onChange={ handleFormChange }
        >
          <FormField name="youtubeId" label="视频ID：">
            <TextBox value={ formValue.youtubeId } />
          </FormField>
          <FormField name="type" label="下载类型：">
            <ComboBox value={ formValue.type } data={
              [
                { value: 'video', text: '视频' },
                { value: 'live', text: '直播' }
              ]
            } />
          </FormField>
        </Form>
      </div>
      <div className="dialog-button">
        <LinkButton iconCls="icon-cancel" onClick={ handleCloseClick }>关闭</LinkButton>
        <LinkButton iconCls="icon-ok" onClick={ handleAddClick }>添加</LinkButton>
      </div>
    </Dialog>
  );
});

export default AddForm;