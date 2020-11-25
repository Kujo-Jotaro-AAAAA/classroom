import { useState, useEffect, useRef, useMemo } from 'react'
interface PropTypes {
}
export default function useReward() {
  const [visible, setVisible] = useState<boolean>(false)
  const [replyNum, setReplyNum] = useState<number>(0) // 答题次数
  const getStar = useMemo(() => {
    // 1次 3星， 3次以上1星
    const starMap = {
      1 : 3,
      2: 2,
      3: 1
    }
    return starMap[replyNum] || 1
  }, [replyNum])
  function onClose() {
    setVisible(false)
  }
  /**
   * @description 重置提交次数
   */
  function resetReply() {
    setReplyNum(0)
  }
  return {
    replyNum,
    getStar,
    setReplyNum,
    resetReply,
    visible,
    setVisible,
    onClose
  }
}
