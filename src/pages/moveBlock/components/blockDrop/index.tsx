/**
 * @description 职业类别
 */
import React, { useState, useEffect, FC } from 'react'
import styles from '../../styles/index.less'
import DropItem from './components/dropItem';
interface PropTypes {
  dropList: string[]
  assert: {
    [propsName: string]: string
  }
}
const BlockDrop: FC<PropTypes> = function ({dropList, assert}) {
  const defaultList: string[] = ['yellow', 'red', 'blue','yellow', 'red', 'blue']
  /**
   * @description 创建视图的盒子
   */
  function createBlockList() {
    return defaultList.map((item, key) => {
      return <div className={styles['move_block-drop-box']} key={key}>
        <img src={assert[item]} />
      </div>
    });
  }
  /**
   * @description 生成拓展的坑位
   */
  function createDropItem() {
    if (!Array.isArray(dropList)) return
    return dropList.map((item, key) => {
      return <DropItem assert={assert} bg={item} key={key} index={key} />
    })
  }
  return (
    <div className={styles['move_block-drop']}>
      {createBlockList()}{createDropItem()}
    </div>
  )
}

export default BlockDrop
