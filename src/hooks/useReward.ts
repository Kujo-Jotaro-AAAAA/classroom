import { useState, useEffect, useRef, useMemo } from 'react'
import { session } from '@/utils/store';
export const replySessionKey = 'reply'
interface PropTypes {
}
export default function useReward() {
  const [visible, setVisible] = useState<boolean>(false)
  const [replyNum, setReplyNum] = useState<number>(0) // 答题次数
  const getStar = useMemo(getStarFn, [replyNum])
  function getStarFn(num?: number) {
    const starMap = {
      1 : 3,
      2: 2,
      3: 1
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
    session.setKey(replySessionKey, String(num))
  }
  function getSessionReply() {
    return  Number(session.getKey(replySessionKey))
  }
  function clearSessionReply() {
    return  session.removeKey(replySessionKey)
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
    // sessionReply
    setSessionReply,
    getSessionReply,
    clearSessionReply
  }
}
