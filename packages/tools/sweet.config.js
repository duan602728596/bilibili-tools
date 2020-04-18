import process from 'process';
import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';

// 配置nodejs的外部扩展
function nodeExternals(externals) {
  const result = {};

  for (const item of externals) {
    result[item] = `globalThis.require('${ item }')`;
  }

  return result;
}

const isDev = process.env.NODE_ENV === 'development';

export default function(info) {
  const nodeModules = path.join(__dirname, '../../node_modules/rc-easyui/dist'),
    dist = path.join(__dirname, 'dist/scripts');

  const config = {
    frame: 'react',
    dll: [
      'react',
      'prop-types',
      'react-router',
      'react-router-dom',
      'redux',
      'react-redux',
      'redux-actions',
      'redux-thunk',
      'immutable',
      'reselect',
      'indexeddb-tools',
      'indexeddb-tools-redux'
    ],
    entry: {
      index: [path.join(__dirname, 'src/index.js')]
    },
    externals: {
      ...nodeExternals([
        '@bilibili-tools/ffmpeg',
        'child_process',
        'electron',
        'fs',
        'got',
        'jsdom',
        'path',
        'querystring',
        'stream',
        'url',
        'util'
      ]),
      'rc-easyui': 'globalThis.EasyUI'
    },
    js: {
      ecmascript: true,
      plugins: isDev ? [['transform-react-remove-prop-types', { mode: 'remove', removeImport: true }]] : undefined,
      exclude: /node_modules/
    },
    html: [
      { template: path.join(__dirname, 'src/index.pug') }
    ],
    plugins: [
      new CopyWebpackPlugin([{
        from: path.join(nodeModules, 'rc-easyui-min.js'),
        to: dist }
      ].concat(isDev ? [{ from: path.join(nodeModules, 'rc-easyui-min.js.map'), to: dist }] : []))
    ]
  };

  // 热替换
  if (isDev) {
    config.resolve = {
      alias: {
        'react-dom': '@hot-loader/react-dom'
      }
    };
  }

  return config;
}