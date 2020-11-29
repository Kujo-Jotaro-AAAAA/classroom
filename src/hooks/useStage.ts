import { useState, useEffect, useRef } from 'react'
import * as spritejs from 'spritejs'
import {BASE_WIDTH, BASE_HEIGHT} from '@/utils/detectOrient';
const { Scene, Sprite, Gradient, Rect, Block, Label } = spritejs
interface PropTypes {
  elId: string
}
export default function useStage(props: PropTypes) {
  const reward = useRef(null)
  const [stage, setStage] = useState(null)
  useEffect(() => {
    reward.current = document.getElementById(props.elId)
    const scene = new Scene({
      container: reward.current,
      width: BASE_WIDTH,
      height: BASE_HEIGHT,
    })
    const layer = scene.layer()
    setStage({
      scene,
      layer,
    })
  }, [])
  /**
   * @description 生成当前页面的快照
   */
  function toImage(scene) {
    return scene.snapshot().toDataURL()
  }
  return {
    stage,
    vpWidth: BASE_WIDTH,
    vpHeight: BASE_HEIGHT,
    halfVp: { // 居中
      w: BASE_WIDTH/2,
      h: BASE_HEIGHT/2
    },
    toImage
  }
}
