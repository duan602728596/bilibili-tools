/* 项目配置 */
const config = {
  indexedDB: {
    name: 'bilibili-tools',
    version: 1,
    objectStore: [
      {
        name: 'options',
        keyPath: 'id',
        index: ['liveId', 'liveName']
      }
    ]
  }
};

export default config;