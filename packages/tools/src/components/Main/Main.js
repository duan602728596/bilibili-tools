import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import style from './main.sass';

function Main(props) {
  return (
    <div className={ classNames(style.main, props.className) }>
      { props?.children }
    </div>
  );
}

Main.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
};

export default Main;