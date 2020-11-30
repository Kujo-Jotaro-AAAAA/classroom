/**
 * @description 生成传入的配置
 */
import { useState, useEffect, useRef } from 'react'
import * as spritejs from 'spritejs'
import * as Types from 'spritejs/typings/spritejs.d';
import {BACK} from '@/utils/bridge';
const assetsMap = {
  back: require('@/assets/back.png')
}
const {  Sprite, Rect, Block, Label, Polyline, Path, Group, Ring } = spritejs
// type ElesType = Types.Label | Types.Sprite | Types.Rect | Types.Block
type ElesType = any
export enum EleTypeEnums {
  LABEL = 'label',
  SPRITE = 'sprite',
  RECT = 'rect',
  BLOCK = 'block',
  POLYLINE = 'polyline',
  PATH = 'path',
  GROUP = 'group',
  RING = 'ring',
}
export enum EvtNameEnum {
  TOUCH_START = 'touchstart',
  TOUCH_MOVE = 'touchmove',
  TOUCH_END = 'touchend',
  DROP_CAPTURE = 'drop',
  CLICK = 'click',
}
interface EleEventAttrsTypes {
  stage: {
    scene: any,
    layer: any
  }
}
export interface EleEventTypes  {
  type: EvtNameEnum,
  callback: (evt, el, attrs?: EleEventAttrsTypes) => void
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
  animates?: EleAnimateTypes[],
  children?: ElesConfig[] // group专属
}
interface PropTypes {
  eles?: ElesConfig[],
  stage: any
}
export default function useCreateEle(props: PropTypes) {
  const [elements, setElements] = useState<any>([])
  const [eles, setEles] = useState<ElesConfig[]>([])
  const [elesMerge, setElesMerge] = useState<ElesConfig[]>([]),
  defaultCommon = ['navBar'], // 默认挂载的组件
  commonAnimate = { // 通用动画
    duration: 500,
    easing: 'linear',
    direction: 'alternate',
    iterations: 1,
    fill: 'forwards',
  }
  const createFnMap = { // 生成配置项的方法
    label: createLabel,
    sprite: createSprite,
    rect: createRect,
    block: createBlock,
    polyline: createPolyline,
    path: createPath,
    ring: createRing,
    group: createGroup
  }
  useEffect(() => {
    if (Array.isArray(props.eles)) {
      setEles(props.eles.concat(createCommomEle()))
    }
  }, [])
  useEffect(() => {
    setElesMerge(createCommomEle().concat(eles))
  }, [eles])
  useEffect(() => {
    const queue = createQueue(elesMerge);
    setElements(queue)
  }, [elesMerge])
  useEffect(() => {
    if (!props.stage) return
    if (!elements || elements.length === 0) return
    payloadElement(elements)
  }, [elements])
  /**
   * @description 创建默认的组件
   */
  function createCommomEle(): ElesConfig[] {
    return defaultCommon.map((key, idx) => {
      return {
        type: EleTypeEnums.SPRITE,
        option: {
          name: 'default_back',
          texture: assetsMap.back,
          pos: [35, 36],
          size: [16, 28]
        },
        evt: [{
          type: EvtNameEnum.CLICK,
          callback: (evt, elm) => {
            console.log('返回上一步');
            BACK()
          }
        }]
      }
    })
  }
  /**
   * @description 挂载dom及事件、动画
   */
  function payloadElement(elements) {
    elements.forEach((el, idx) => {
      const events = elesMerge[idx].evt
      const animates = elesMerge[idx].animates
      handleEvent(el, events)
      handleAnimates(el, animates)
      props.stage.layer.append(el)
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
          ev.callback(evt, el, {
            stage: props.stage
          })
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
  function createQueue(eles) {
    if (!Array.isArray(eles)) return []
    return eles.map(eleConfig => {
      const fn = createFnMap[eleConfig.type]
      return fn && fn(eleConfig.option, eleConfig.children)
    })
  }
  function createLabel(op: Types.Label) {
    return new Label(op)
  }
  function createSprite(op: any) {
    return new Sprite(op)
  }
  function createRect(op: Types.Rect) {
    return new Rect(op)
  }
  function createBlock(op: Types.Block) {
    return new Block(op)
  }
  function createPolyline(op) {
    return new Polyline(op)
  }
  function createPath(op) {
    return new Path(op)
  }
  function createRing(op) {
    return new Ring(op)
  }
  function createGroup(op, children) {
    const queue = createQueue(children)
    const group = new Group(op)
    const childrenElms = payloadGroupElement(queue, children)
    childrenElms.forEach(elm => {
      group.append(elm)
    });

    return group
  }

  function payloadGroupElement(elements, children) {
    elements.forEach((el, idx) => {
      const events = children[idx].evt
      const animates = children[idx].animates
      handleEvent(el, events)
      handleAnimates(el, animates)
    })
    return elements
  }

  /* ********=*****************  工具函数   ******************************************************** */
  /**
   * @description 根据元素名称，查到到对应的元素
   * @param name
   */
  function findEleByName(elm, name: string) {
    return elm.find(ele => {
      return ele.name === name
    })
  }
  /**
   * @description 根据元素名称列表，查到到对应的元素
   * @param name
   */
  function findElesByNames(elm, names: string[]) {
    if (!Array.isArray(names)) return null
    return names.map(name => {
      return findEleByName(elm, name)
    })
  }
  /**
   * @description 给对应的元素挂载事件列表
   */
  function payloadEvtsByNames(elm, names: string[], evts: EleEventTypes[]) {
    const elms = findElesByNames(elm, names)
    elms.forEach(el => {
      evts.forEach(evt => {
        el?.addEventListener(evt.type, (e) => {
          evt.callback(e, el)
        })
      })
    })
    return elms
  }
  /**
   * @description 重置elm的属性
   * @param elms
   * @param attrKeys
   */
  function resetElmsAttr(elms, attrKeys: string[]) {
    elms.forEach(elm => {
      attrKeys.forEach(attr => {
        elm.removeAttribute(attr)
      })
    });
  }
  /**
   * @description 获取className, 可用于同类型的元素获取
   * @param layer
   * @param classname
   */
  function findClassNameByLayer(layer, classname: string) {
    return layer.getElementsByClassName(classname)
  }
  /**
   * @description name, 可用于同类型的元素获取
   * @param layer
   * @param classname
   */
  function findNameByLayer(layer, name: string): any[] {
    return layer.getElementsByName(name)
  }
  /**
   * @description name, 获取多个name
   * @param layer
   * @param classname
   */
  function findNamesByLayer(layer, names: string[]) {
    return names.map(name => {
      return findNameByLayer(layer, name)
    }).flat()
  }
  return {
    elements,
    createLabel,
    createSprite,
    createRect,
    createBlock,
    createPolyline,
    findEleByName,
    findElesByNames,
    eles,
    setEles,
    payloadEvtsByNames,
    resetElmsAttr,
    commonAnimate,
    findClassNameByLayer,
    findNameByLayer,
    findNamesByLayer
  }
}
