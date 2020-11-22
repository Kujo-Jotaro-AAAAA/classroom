import React, { useState, useEffect, useMemo } from 'react'
import styles from './styles/index.less'
import Reward from '@/components/reward';
interface PropTypes {}
const Demo = (props: PropTypes) => {
  return (
    <div className={styles.demo}>
      <Reward star={2} />
    </div>
  )
}
export default Demo
