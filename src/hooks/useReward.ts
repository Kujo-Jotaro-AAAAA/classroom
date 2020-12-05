import { useState, useEffect, useRef, useMemo } from 'react'
import { session } from '@/utils/store';
import { PLAY_AUDIO} from '@/utils/bridge';
export const replySessionKey = 'reply'
interface PropTypes {
}
export default function useReward() {
  const [visible, setVisible] = useState<boolean>(false)
  const [replyNum, setReplyNum] = useState<number>(0) // 答题次数
  const getStar = useMemo(getStarFn, [replyNum])
  function getStarFn(num?: number) {
    const starMap = {
      0: 3,
      1: 2,
      2: 1,
    }
    return starMap[num || replyNum] || 1
  }
  function onClose() {
    setVisible(false)
  }
  function addReply() {
    setReplyNum(replyNum + 1)
  }
  /**
   * @description 重置提交次数
   */
  function resetReply() {
    setReplyNum(0)
  }
  /**
   * @description 如果是遍历的组件，无法更新hook里的值，只能放到session
   * @param num
   */
  function setSessionReply (num: number) {
    PLAY_AUDIO('L0019') // 再想想
    PLAY_AUDIO('SE0001') // 错误音效
    session.setKey(replySessionKey, String(num))
  }
  function addSessionReply() {
    setSessionReply(getSessionReply() + 1)
  }
  function getSessionReply() {
    return  Number(session.getKey(replySessionKey))
  }
  function clearSessionReply() {
    return  session.removeKey(replySessionKey)
  }
  function getSessionStar() {
    return getStarFn(getSessionReply())
  }
  return {
    replyNum,
    getStar,
    setReplyNum,
    addReply,
    resetReply,
    visible,
    setVisible,
    getStarFn,
    onClose,
    addSessionReply,
    setSessionReply,
    getSessionReply,
    getSessionStar,
    clearSessionReply
  }
}
