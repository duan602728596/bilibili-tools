import React from 'react';
import { useRoutes } from 'react-router-dom';
import loadModels from '../../store/loadModels';
import models from './models/models';
import LiveList from './LiveList';
import Options from './Options';

function Index(props) {
  const routes = useRoutes([
    { path: '/', element: <LiveList /> },
    { path: 'Options', element: <Options /> }
  ]);

  return routes;
}

export default loadModels(models)(Index);