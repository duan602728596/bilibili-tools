import React, { forwardRef, useState, useRef, useImperativeHandle } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { Dialog, Form, FormField, TextBox, ComboBox, LinkButton } from 'rc-easyui';
import style from './addForm.sass';
import { randomId } from '../../utils/utils';
import { setDownloadList } from './models/models';

/* state */
const state = createStructuredSelector({
  bilibiliDownload: createSelector(
    ({ bilibiliDownload: $$bilibiliDownload }) => $$bilibiliDownload?.get?.('downloadList'),
    (data) => data?.toJS?.() ?? []
  )
});

const AddForm = forwardRef(function(props, ref) {
  const { bilibiliDownload } = useSelector(state);
  const dispatch = useDispatch();
  const formRef = useRef(null),
    dialogRef = useRef(null);
  const [formValue, setFormValue] = useState({
    sessData: localStorage.getItem('SESSDATA')
  }); // 表单的值

  // 关闭
  function handleCloseClick() {
    dialogRef.current.close();
    setFormValue((prevState) => {
      return {
        ...prevState,
        bid: undefined,
        type: undefined
      };
    });
  }

  // 添加到队列
  function handleAddClick() {
    formRef.current.validate((err) => {
      if (err) return;

      const sessData = formValue.sessData;
      const id = randomId(30);

      // 缓存cookie
      if (sessData && !/^\s*$/.test(sessData)) {
        localStorage.setItem('SESSDATA', sessData);
      }

      bilibiliDownload.push({ id, ...formValue });
      bilibiliDownload |> setDownloadList |> dispatch;
      handleCloseClick();
    });
  }

  // 表单的change事件
  function handleFormChange(key, value) {
    setFormValue((prevState) => {
      return { ...prevState, [key]: value };
    });
  }

  useImperativeHandle(ref, () => ({ dialogRef }), []);

  return (
    <Dialog ref={ dialogRef } title="添加下载队列" modal={ true } closed={ true }>
      <div className={ style.formBox }>
        <Form ref={ formRef }
          model={ formValue }
          labelWidth={ 80 }
          rules={{
            bid: ['required'],
            type: ['required']
          }}
          onChange={ handleFormChange }
        >
          <FormField name="bid" label="下载ID：">
            <TextBox value={ formValue.bid } />
          </FormField>
          <FormField name="type" label="下载类型：">
            <ComboBox value={ formValue.type } data={
              [
                { value: 'bv', text: 'BV（视频）' },
                { value: 'av', text: 'AV（视频）' },
                { value: 'au', text: 'AU（音频）' }
              ]
            } />
          </FormField>
          <FormField name="sessData" label="Cookie(SESSDATA)：" labelPosition="top" labelWidth={ 200 }>
            <TextBox style={{ padding: '4px', height: '60px' }} value={ formValue.cookie } multiline={ true } />
          </FormField>
          <p className={ style.desc }>这个是cookie内的SESSDATA字段。部分高清视频需要该字段。请自行抓取该字段填入此处。</p>
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