import querystring from 'querystring';
import request from '../../../utils/request';

/**
 * 获取音频接口
 * @param { string } id: 音频id
 */
export function requestAudioPlayUrl(id) {
  const query = querystring.stringify({
    sid: id,
    privilege: 2,
    quality: 2
  });

  return request(`https://www.bilibili.com/audio/music-service-c/web/url?${ query }`);
}