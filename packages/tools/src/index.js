import React from 'react';
import { render } from 'react-dom';
import App from './App';
import dbInit from './utils/dbInit';

dbInit();

/* app */
render(
  <App />,
  document.getElementById('app')
);

if (module.hot) {
  module.hot.accept();
}