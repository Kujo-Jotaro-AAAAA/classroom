/**
 * @description 返回
 */
export const BACK = () => {
  try {
    onBackPress.postMessage('onBackPress')
  } catch (error) {
    console.log('native onBackPress');
  }
}
/**
 * @description 录音开始
 */
export const VOICE_RECORD_START = () => {
  try {
    voiceRecordStart.postMessage('voiceRecordStart')
  } catch (error) {
    console.log('voiceRecordStart');
  }
}
/**
 * @description 录音结束
 */
export const VOICE_RECORD_END = () => {
  try {
    voiceRecordEnd.postMessage('voiceRecordEnd')
  } catch (error) {
    console.log('voiceRecordEnd');
  }
}
/**
 * @description 录音播放
 */
export const VOICE_RECORD_PLAY = () => {
  try {
    voiceRecordPlay.postMessage('voiceRecordPlay')
  } catch (error) {
    console.log('voiceRecordPlay');
  }
}
/**
 * @description 下一步
 */
export const NEXT_STEP = () => {
  try {
    nextStep.postMessage('nextStep')
  } catch (error) {
    console.log('nextStep');
  }
}
/**
 * @description 录音完成
 */
export const VOICE_RECORD_COMPLETE = () => {
  try {
    voiceRecordComplete.postMessage('savePicture')
  } catch (error) {
    console.log('savePicture');
  }
}
/**
 * @description 录音完成
 */
export const SHOW_TOAST = () => {
  try {
    showToast.postMessage('showToast')
  } catch (error) {
    console.log('showToast');
  }
}
/**
 * @description 截图
 */
// export const GET_PICTURE = () => {
//   try {
//     getLocalPicture.postMessage('getLocalPicture')
//   } catch (error) {
//     console.log('getLocalPicture');
//   }
// }
// @ts-ignore
export const GET_PICTURE = function getLocalPicture (path) {
  // @ts-ignore
  console.log(this);
  return path
}

export default {
  BACK,
  VOICE_RECORD_START,
  VOICE_RECORD_END,
  VOICE_RECORD_PLAY,
  NEXT_STEP,
  GET_PICTURE,
  VOICE_RECORD_COMPLETE,
  SHOW_TOAST
}
