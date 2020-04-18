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

/**
 * 获取视频页面
 * @param { 'av' | 'bv' } type: 视频类型
 * @param { string } id: 视频id
 * @param { number } page
 */
export function requestBilibiliVideo(type, id, page = 1) {
  const reqType = type === 'av' ? 'av' : 'BV';

  return request(`https://www.bilibili.com/video/${ reqType }${ id }?p=${ page }`, {
    responseType: 'text',
    headers: {
      Host: 'www.bilibili.com',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36'
        + ' (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36 Edg/80.0.361.109'
    }
  });
}

/**
 * 从接口中获取数据
 * @param { string } avid
 * @param { number } cid
 * @param { string | undefined } sessData
 */
export function requestPlayUrl(avid, cid, sessData) {
  const query = querystring.stringify({
    avid,
    cid,
    qn: 80,
    otype: 'json',
    fnver: 0,
    fnval: 16
  });

  return request(`https://api.bilibili.com/x/player/playurl?${ query }`, {
    headers: {
      Cookie: sessData ? `SESSDATA=${ sessData }; CURRENT_QUALITY=80;` : undefined
    }
  });
}