import { useState, useEffect, useRef } from 'react'
interface PropTypes {
}
export default function useReward() {
  const [visible, setVisible] = useState<boolean>(false)
  function onClose() {
    setVisible(false)
  }
  return {
    visible,
    setVisible,
    onClose
  }
}
