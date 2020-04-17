import React from 'react';
import { useRoutes } from 'react-router-dom';
import asyncModule from './asyncModule';
import Index from '../pages/Index/index';

const BilibiliLive = asyncModule(
  () => import(/* webpackChunkName: 'bilibiliLive' */ '../pages/BilibiliLive/index'));
const BilibiliDownload = asyncModule(
  () => import(/* webpackChunkName: 'bilibiliDownload' */ '../pages/BilibiliDownload/index')
);

function Routers(props) {
  const routes = useRoutes([
    { path: '/', element: <Index /> },
    { path: 'BilibiliLive/*', element: <BilibiliLive /> },
    { path: 'BilibiliDownload/*', element: <BilibiliDownload /> }
  ]);

  return routes;
}

export default Routers;