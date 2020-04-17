import React, { useRef } from 'react';
import { Messager } from 'rc-easyui';

function useMessage() {
  const messageRef = useRef(null);

  function alert(args) {
    messageRef.current.alert(args);
  }

  function confirm(args) {
    messageRef.current.confirm(args);
  }

  return [
    <Messager key="message" ref={ messageRef } />,
    { alert, confirm }
  ];
}

export default useMessage;