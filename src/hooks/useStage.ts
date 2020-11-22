import { useState, useEffect, useRef } from 'react'
import * as spritejs from 'spritejs'
const { Scene, Sprite, Gradient, Rect, Block, Label } = spritejs
interface PropTypes {
  elId: string
}
const vpWidth = window.innerWidth;
const vpHeight = window.innerHeight;
export default function useStage(props: PropTypes) {
  const reward = useRef(null)
  const [stage, setStage] = useState(null)
  useEffect(() => {
    reward.current = document.getElementById(props.elId)
    const scene = new Scene({
      container: reward.current,
      width: vpWidth,
      height: vpHeight,
    })
    const layer = scene.layer()
    setStage({
      scene,
      layer,
    })
  }, [])
  return {
    stage,
    vpWidth,
    vpHeight,
    halfVp: { // 居中
      w: vpWidth/2,
      h: vpHeight/2
    }
  }
}
