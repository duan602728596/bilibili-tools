import React from 'react';
import PropTypes from 'prop-types';
import { Panel } from 'rc-easyui';
import Main from '../Main/Main';
import style from './basicPanel.sass';

function BasicPanel(props) {
  const { children, ...otherProps } = props;

  return (
    <Panel className={ style.panel } { ...otherProps }>
      <Main className={ style.main }>{ children }</Main>
    </Panel>
  );
}

BasicPanel.propTypes = {
  children: PropTypes.node
};

export default BasicPanel;