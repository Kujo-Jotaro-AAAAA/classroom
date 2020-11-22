import React, { useState, useMemo} from 'react';
import styles from './styles/index.less';
export default function BalloonImage() {
  const [active, setActive] = useState<number>()
  const balloons = useMemo(() => {
    const list = [require('@/assets/png0015.png'), require('@/assets/png0016.png'), require('@/assets/png0017.png')]
    return list
  }, [])
  function createBalloons() {
    return balloons.map((bSrc, idx) => {
      return <div key={idx}
      className={`animate__animated ${idx === active ? 'animate__shakeX': ''}`}
      onClick={() => onBalloonClick(idx)}
      >
        <img src={bSrc} alt=""/>
      </div>
    })
  }
  function onBalloonClick(idx: number) {
    setActive(idx)
  }
  return <div className={styles.balloon}>
    {createBalloons()}
  </div>
}
