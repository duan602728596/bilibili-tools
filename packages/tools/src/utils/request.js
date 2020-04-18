import util from 'util';
import stream from 'stream';
import fs from 'fs';
import got from 'got';

const pipeline = util.promisify(stream.pipeline);

/**
 * 流请求，下载视频和音频
 * @param { string } file: 文件
 * @param { string } uri: 请求地址
 * @param { object } options: http.request的配置
 */
export async function httpStreamRequest(file, uri, options) {
  await pipeline(got.stream(uri, options), fs.createWriteStream(file));
}

/**
 * 请求方法
 * @param { string } uri: 请求地址
 * @param { object } options: http.request的配置
 */
async function httpRequest(uri, options) {
  const reqOptions = { responseType: 'json' };

  Object.assign(reqOptions, options);

  const res = await got(uri, reqOptions);

  return { data: res.body, status: res.statusCode, response: res };
}

export default httpRequest;