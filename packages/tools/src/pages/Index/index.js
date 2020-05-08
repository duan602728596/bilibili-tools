import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import {
  VideoCameraOutlined as IconVideoCameraOutlined,
  CloudDownloadOutlined as IconCloudDownloadOutlined,
  YoutubeOutlined as IconYoutubeOutlined
} from '@ant-design/icons';
import { Panel } from 'rc-easyui';
import style from './index.sass';
import Main from '../../components/Main/Main';
import Version from './version';

const routes = [
  {
    icon: <IconVideoCameraOutlined />,
    href: '/BilibiliLive',
    name: 'B站直播录制',
    color: style.colorMagenta
  },
  {
    icon: <IconCloudDownloadOutlined />,
    href: '/BilibiliDownload',
    name: 'B站视频下载',
    color: style.colorLime
  },
  {
    icon: <IconYoutubeOutlined />,
    href: '/YoutubeDownload',
    name: 'Youtube视频下载',
    color: style.colorGold
  }
];

/* 首页导航 */
function navRender() {
  return routes.map((route, index) => {
    return (
      <li key={ route.name } className={ style.navItem }>
        <Link className={ classNames(style.navLink, route.color) } to={ route.href }>{ route.icon }</Link>
        <b className={ style.navLinkText }>
          <Link className={ style.navLinkTextHref } to={ route.href }>{ route.name }</Link>
        </b>
      </li>
    );
  });
}

/* footer */
function panelFooterRender() {
  return <Version />;
}

/* 首页导航 */
function Index(props) {
  return (
    <Panel className={ style.panel } footer={ panelFooterRender }>
      <Main>
        <nav className={ style.navBox }>
          <ul className={ style.navList }>{ navRender() }</ul>
        </nav>
      </Main>
    </Panel>
  );
}

export default Index;