/**
 * @description 职业类别
 */
import React, { useState,useEffect, useRef, useContext } from 'react'
import { DragSourceMonitor, useDrag } from 'react-dnd'
import styles from '../styles/index.less'
import { DragSource, DragPreviewImage } from 'react-dnd'
import { IMAGE_TYPES } from '@/typings/enum'
import {debounce} from 'lodash';
import {ContextTypes,MoveContext} from '../index';
interface PropTypes {
  idx: number // 自身所处的sub
  src: string // 图片路径
  bg: string // 背景标识
  orBg: string // 背景标识
  onDragEnd: (item?: any) => void
  onDragStart: (item) => void
  onChange: (bg: string, idx: number) => void // 拖拽造成选项区值变更时
}

const BlockItem: React.FC<PropTypes> = function ({src,idx,orBg,onDragStart, bg, onDragEnd, onChange}) {
  // const [isDragging, setIsDragging] = useState<boolean>(false)
  // const [isDrop, setIsDrop] = useState<boolean>(false) // 已放置到坑位
  const bgRef = useRef(bg)
  const box = {
    type: IMAGE_TYPES.BLOCK_TYPE,
    idx,
    bg
  }
  const [collectedProps, drag, dom] = useDrag({
    item: box,
    // previewOptions: {
    //   captureDraggingState: true
    // },
    begin(monitor: DragSourceMonitor) {
      console.log('开始拖拽了');
      // setIsDragging(true)
      onDragStart(bg)
      onChange && onChange('', idx)
      return box
    },
    end(_: unknown, monitor: DragSourceMonitor) {
      if (monitor.didDrop()) {
        const result = monitor.getDropResult()
        console.log('已放置', result);
        onDragEnd(result)
      } else {
        console.log('未放置成功', bg, idx);
        onDragEnd()
        onChange && onChange(bgRef.current, idx)
      }
      // setIsDragging(false)
    },
  })
  return <div>
    <div className={styles['move_block-drag-item']} ref={drag}>
        {/* draggable*/}
      <img src={src} alt=""  style={{
        opacity: bg ? 1 : 0
      }}  />
    </div>

  </div>
}

export default BlockItem
