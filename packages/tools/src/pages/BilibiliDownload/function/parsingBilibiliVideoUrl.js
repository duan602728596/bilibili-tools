import { JSDOM } from 'jsdom';

/**
 * 解析initialState
 * @param { Array<HTMLScriptElement> } scripts
 */
function parsingInitialState(scripts) {
  let initialState = null;

  for (const script of scripts) {
    const scriptStr = script.innerHTML;

    if (/^window\._{2}INITIAL_STATE_{2}\s*=\s*.+$/.test(scriptStr)) {
      const str = scriptStr
        .replace(/window\._{2}INITIAL_STATE_{2}\s*=\s*/, '') // 剔除"="前面的字符串
        .replace(/;\(function\(\){var s;.+$/i, '');          // 剔除后面可能存在的函数

      initialState = JSON.parse(str);
      break;
    }
  }

  return initialState;
}

/**
 * 解析playInfo
 * @param { Array<HTMLScriptElement> } scripts
 */
function parsingPlayInfo(scripts) {
  let playInfo = null;

  for (const script of scripts) {
    const scriptStr = script.innerHTML;

    if (/^window\._{2}playinfo_{2}=.+$/.test(scriptStr)) {
      const str = scriptStr
        .replace(/window\.__playinfo__=/, '')       // 剔除"="前面的字符串
        .replace(/;\(function\(\){var s;.+$/i, ''); // 剔除后面可能存在的函数

      playInfo = JSON.parse(str);
      break;
    }
  }

  return playInfo;
}

/**
 * 根据data获取视频和音频地址
 * @param { object } data
 */
function getVideoAndAudioUrl(data) {
  const { accept_description, accept_quality, dash } = data;
  const { audio, video } = dash;

  // 解析视频画质
  const qualityMap = new Map();

  accept_quality.forEach(function(value, index) {
    qualityMap.set(value, accept_description[index]);
  });

  // 拼接地址
  const audioUrl = audio.map((item, index) => ({
    value: item.baseUrl,
    text: `地址${ index + 1 }`
  }));
  const videoUrl = video.map((item, index) => ({
    value: item.baseUrl,
    text: `地址${ index + 1 }（${ qualityMap.get(item.id) }）`
  }));

  return { audioUrl, videoUrl };
}

/**
 * 视频下载
 * @param { string } html: html字符串
 */
function parsingBilibiliVideoUrl(html) {
  const dom = new JSDOM(html);
  const { document } = dom.window;

  // 从script标签中获取initialState
  const scripts = document.querySelectorAll('script');
  const [initialState, playInfo] = [parsingInitialState(scripts), parsingPlayInfo(scripts)];

  // 需要同时下载视频或者音频，然后合并
  if (playInfo?.data?.dash) {
    return getVideoAndAudioUrl(playInfo.data);
  }
}

export default parsingBilibiliVideoUrl;