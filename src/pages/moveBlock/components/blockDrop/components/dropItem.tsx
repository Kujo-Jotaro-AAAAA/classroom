/**
 * @description 职业类别
 */
import React, {useMemo, useState} from 'react'
import { useDrop, XYCoord } from 'react-dnd';
import { IMAGE_TYPES } from '@/typings/enum';
import classnames from 'classnames';
import styles from '../../../styles/index.less'
interface PropTypes {
  bg: string
  assert: {
    [propsName: string]: string
  }
  index: number
}
const DropItem: React.FC<PropTypes> = function DropItem({bg, assert, index}) {
  const [originStart, setOriginStart] = useState<XYCoord>() // 记录拖拽最开始的位置
  const [originItem, setOriginItem] = useState<any>()
  const [, drop ] = useDrop({
      accept: IMAGE_TYPES.BLOCK_TYPE,
      drop: (item, monitor) => {
        const offsetStart = monitor.getInitialClientOffset()
        // const offsetStart = monitor.getInitialSourceClientOffset()
        const isCover = Boolean(originStart);
        const offsetEnd = monitor.getClientOffset() // 放置最后的位置
        // const offsetEnd = monitor.getDifferenceFromInitialOffset() // 放置最后的位置
        setOriginStart(offsetStart)
        setOriginItem(item)
        return {
          ...item,
          originItem,
          originBg: bg,
          index, // 放置的容器的位置
          originStart,
          originEnd: offsetEnd,
          isCover
        }
      }
  });
  const isPlaceholder = useMemo(() => {
    return !bg
  }, [bg])
  return (
    <div className={classnames(`${styles['move_block-drop-box']}`, {
        [styles['placeholder']]: isPlaceholder
      })} ref={drop}>
        <img src={assert[bg]} />
    </div>
  )
}

export default DropItem
