/**
 * @description 职业类别
 */
import React, { FC, useEffect } from 'react'
import styles from './styles/index.less'
const icon = require('@/assets/累积巧虎币.png')
interface PropTypes {
  star: 1 | 2 | 3 // 评分
  visible: boolean
  onClose?: () => void
}
const ResultModal: FC<PropTypes> = function ({ star, visible, onClose }) {
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        onClose && onClose()
      }, 3000)
    }
  }, [visible])
  function createStar() {
    const startDom = []
    for (let i = 1; i <= 3; i++) {
      const has = i <= star
      startDom.push(
        <div className={styles['result_modal-content-star-item']} key={i}>
          {has && <img src={icon} />}
        </div>
      )
    }
    return startDom
  }
  return (
    <>
      {visible && (
        <div
          className={`${styles['result_modal']} animate__animated animate__fadeIn`}
        >
          {/* mask */}
          <div className={styles['result_modal-mask']} onClick={onClose}></div>
          <div className={styles['result_modal-content']}>
            <div className={`${styles['result_modal-content-fraction']} animate__animated animate__bounceIn`}>
              +{star}
            </div>
            <div className={styles['result_modal-content-star']}>
              {createStar()}
            </div>
            <div className={styles['result_modal-content-bg']}></div>
          </div>
        </div>
      )}
    </>
  )
}

export default ResultModal
