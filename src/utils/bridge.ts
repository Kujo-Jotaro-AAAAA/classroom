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

export default {
  BACK,
  VOICE_RECORD_START,
  VOICE_RECORD_END,
  VOICE_RECORD_PLAY,
  NEXT_STEP
}
