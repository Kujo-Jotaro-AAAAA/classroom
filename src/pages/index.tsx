import React from 'react'
import styles from './index.less'
import 'animate.css'
function Index(props) {
  return (
        <div className={styles['content']}>
          {props.children}
        </div>
  )
}
export default Index
