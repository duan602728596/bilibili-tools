import React from 'react';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { LocaleProvider } from 'rc-easyui';
import zhCN from 'rc-easyui/dist/locale/easyui-lang-zh_CN';
import { hot } from '@sweet-milktea/milktea/react-hot-loader/root';
import './global.sass';
import { storeFactory } from './store/store';
import Routers from './router/Routers';

/* 热替换 */
function App(props) {
  return (
    <Provider store={ storeFactory() }>
      <LocaleProvider locale={ zhCN }>
        <HashRouter>
          <Routers />
        </HashRouter>
      </LocaleProvider>
    </Provider>
  );
}

export default hot(App);