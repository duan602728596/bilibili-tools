import request from '../../../utils/request';

/**
 * 请求youtube的html
 * @param { string } youtubeId
 */
export function requestYoutubeHtml(youtubeId) {
  return request(`https://www.youtube.com/watch?v=${ youtubeId }`, {
    responseType: 'text'
  });
}