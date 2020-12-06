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
    voiceRecordComplete.postMessage('voiceRecordComplete')
  } catch (error) {
    console.log('voiceRecordComplete');
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
 * @description 添加硬币
 * @param num
 */
export const ADD_COIN = (num) => {
  try {
    addCoin.postMessage(`${num}`)
  } catch (error) {
    console.log('ADD_COIN');
  }
}
/**
 * @description 播放录音
 * @param name 录音文件名
 * @param type 录音文件类型
 */
export const PLAY_AUDIO = (name, type='wav') => {
  try {
    playAudio.postMessage(`${name}`)
  } catch (error) {
    console.log('PLAY_AUDIO', `${name}.${type}`);
  }
}
/**
 * @description 获取硬币
 */
export const GET_COIN = function getCoin (num) {
  return num
}

export default {
  BACK,
  VOICE_RECORD_START,
  VOICE_RECORD_END,
  VOICE_RECORD_PLAY,
  NEXT_STEP,
  GET_COIN,
  ADD_COIN,
  VOICE_RECORD_COMPLETE,
  SHOW_TOAST,
  PLAY_AUDIO
}
