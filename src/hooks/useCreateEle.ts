/**
 * @description 生成传入的配置
 */
import { useState, useEffect, useRef } from 'react'
import * as spritejs from 'spritejs'
import * as Types from 'spritejs/typings/spritejs.d';
const {  Sprite, Rect, Block, Label } = spritejs
// type ElesType = Types.Label | Types.Sprite | Types.Rect | Types.Block
type ElesType = any
export enum EleTypeEnums {
  LABEL = 'label',
  SPRITE = 'sprite',
  RECT = 'rect',
  BLOCK = 'block'
}
export enum EvtNameEnum {
  TOUCH_START = 'touchstart',
  TOUCH_MOVE = 'touchmove',
  TOUCH_END = 'touchend',
  DROP_CAPTURE = 'drop',
}
export interface EleEventTypes  {
  type: EvtNameEnum,
  callback: (evt, el) => void
}
export interface EleAnimateTypes {
  animate: any[],
  config: any
}
export interface ElesConfig {
  name?: string // 方便查找对应的ele, 不可重复
  type: EleTypeEnums,
  option: ElesType,
  evt?: EleEventTypes[],
  animates?: EleAnimateTypes[]
}
interface PropTypes {
  eles?: ElesConfig[],
  stage: any
}
export default function useCreateEle(props: PropTypes) {
  const [elements, setElements] = useState<any>([])
  const [eles, setEles] = useState<ElesConfig[]>([])
  useEffect(() => {
    if (Array.isArray(props.eles)) {
      setEles(props.eles)
    }
  }, [])
  const createFnMap = {
    label: createLabel,
    sprite: createSprite,
    rect: createRect,
    block: createBlock
  }
  useEffect(() => {
    // 只能初始化生成页面， 动态加载的逻辑写在页面上, 否则死循环
    const queue = createQueue();
    setElements(queue)
  }, [eles])
  useEffect(() => {
    if (!props.stage) return
    if (!elements || elements.length === 0) return
    payloadElement()
  }, [elements])
  /**
   * @description 挂载dom及事件、动画
   */
  function payloadElement() {
    elements.forEach((el, idx) => {
      props.stage.layer.append(el)
      const events = eles[idx].evt
      const animates = eles[idx].animates
      handleEvent(el, events)
      handleAnimates(el, animates)
    })
  }
  /**
   * @description 处理挂载的事件
   * @param el
   * @param events
   */
  function handleEvent(el, events: EleEventTypes[]) {
    if (Array.isArray(events)) {
      events.forEach(ev => {
        el.addEventListener(ev.type, (evt) => {
          ev.callback(evt, el)
        })
      })
    }
  }
  /**
   * @description 处理挂载的动画
   * @param el
   * @param events
   */
  function handleAnimates(el, animates: EleAnimateTypes[]) {
    if (Array.isArray(animates)) {
      animates.forEach(async (ani) => {
        await el.animate(ani.animate, ani.config)
      })
    }
  }
  /**
   * @description 生成配置的挂载的dom队列
   */
  function createQueue() {
    if (!Array.isArray(eles)) return []
    return eles.map(eleConfig => {
      const fn = createFnMap[eleConfig.type]
      return fn && fn(eleConfig.option)
    })
  }
  function createLabel(op: Types.Label) {
    return new Label(op)
  }
  function createSprite(op: Types.Sprite) {
    return new Sprite(op)
  }
  function createRect(op: Types.Rect) {
    return new Rect(op)
  }
  function createBlock(op: Types.Block) {
    return new Block(op)
  }
  function findEle(name: string) {
    return elements.find(ele => {
      return ele.name === name
    })
  }
  return {
    elements,
    createLabel,
    createSprite,
    createRect,
    createBlock,
    findEle,
    eles,
    setEles
  }
}
