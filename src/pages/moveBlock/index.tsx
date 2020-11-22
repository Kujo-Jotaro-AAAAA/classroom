/**
 * @description 职业类别
 */
import React, { useState, useMemo , useEffect, createContext } from 'react'
import BlockItem from './components/blockItem';
import BlockDrop from './components/blockDrop/index';
import styles from './styles/index.less'
import ResultModal from '@/components/resultModal';
import { useSpring, animated } from 'react-spring';
// import { DragSourceMonitor, useDrag } from 'react-dnd'
const [reloadImg, red, yellow, blue] = [
  require('@/assets/重播按钮.png'),
  require('@/assets/png0026.png'),
  require('@/assets/png0027.png'),
  require('@/assets/png0028.png')
]
interface PropTypes {
}
export interface ContextTypes  {
  touchXY: [number, number]
}
const defaultXY: [number, number] = [-100, -100]
export const MoveContext = createContext<ContextTypes>({
  touchXY: defaultXY
})
function MoveBlock(props: PropTypes) {
  const [dropList, setDropList] = useState<string[]>(['', '', ''])
  const [optionList, setOptionList] = useState<string[]>(['red', 'yellow', 'blue']) // 选项
  const [coverData, setCoverData] = useState<any>()
  const [coverBg, setCoverBg] = useState<string>()
  const [dragBg, setDragBg] = useState<string>()
  const [touchXY, setTouchXY] = useState<[number, number]>(defaultXY)
  const [springCallBack, setSpringCallBack] = useState<any>({
    from: undefined,
    to: undefined,
  })
  useEffect(() => {
    if (coverData) {
      console.log('coverData', coverData);
      setCoverBg(coverData.originBg)
      set({
        ...updateSpring(coverData),
        reset: true
      })
      setTimeout(() => {
        const ops = optionList.slice(0)
        ops.splice(coverData?.originItem.idx, 1, coverData?.originBg)
        setOptionList(ops)
        // set({})
        // set({
        //   from: undefined,
        //   to: undefined
        // })
      }, 200)
    }
  }, [coverData])
  function updateSpring(coverData) {
    if (coverData) {
      return {
        from: {
          opacity: 1,
          left: `${coverData.originEnd.x}px`,
          top: `${coverData.originEnd.y}px`
        },
        to: [
          {
            opacity: 0,
            left: `${coverData.originStart.x}px`,
            top: `${coverData.originStart.y}px`,
            display: 'none'
          }
        ],
        config: { duration: 200, mass: 5, tension: 350, friction: 40},
        // reset: resetSpring,
        onRest: () => {
          // set({})
          console.log('onRest coverData');
          // setResetSpring(false)
          // const ops = optionList.slice(0)
          // console.log('执行完毕');
          // ops.splice(coverData.originItem.idx, 1, coverData.originBg)
          // setOptionList(ops)
          // setCoverData(undefined)
        }
      }
    }
    return {
      from: undefined,
      to: undefined
    }
  }
  const [stylesProps, set] = useSpring(() => ({}));
  const [visible, setVisible] = useState(false);
  const answer = ['yellow', 'red', 'blue'] // 正确答案
  const blockMap = useMemo(() => {
    return {
      red,
      yellow,
      blue
    }
  }, [])
  /**
   * @description 开始时记录拖拽的盒子
   */
  function onDragStart(bg: string) {
    setDragBg(bg)
  }
  /**
   * @description 拖拽选择器
   */
  function createSelector() {
    const defaultOptionList = ['red', 'yellow', 'blue']
    return optionList.map((bg, key) => {
      const orBg = blockMap[defaultOptionList[key]]
      return <BlockItem bg={bg} orBg={orBg} src={blockMap[bg]} idx={key} key={key} onDragStart={onDragStart} onDragEnd={onDragEnd} onChange={onOptionChange} />
    })
  }
  /**
   * @description 选项区拖拽变更
   * @param bg
   */
  function onOptionChange(bg: string, idx: number) {
    optionList.splice(idx, 1, bg)
    setOptionList([...optionList])
  }
  /**
   * @description 拖拽结束后
   * @param index
   * @param bg 色块标识
   * @param originStart 源目标
   * @param isCover 是覆盖操作
   */
  function onDragEnd(result) {
    setTouchXY(defaultXY)
    setDragBg(undefined)
    if (!result) return // 未放置成功
    const { index, idx, bg,originBg,originItem, originStart, originEnd, isCover} = result
    if (isCover) { // 覆盖操作, 取消原来的色块, 触发复原动画
      setCoverData({ index, idx, bg,originBg,originItem, originStart, originEnd, isCover})
    }
     // 填充
    dropList.splice(index, 1, bg)
    setDropList([...dropList])
  }
  /**
   * @description 提交答案
   */
  function submit() {
    if (dropList.some(bg => !bg)) {
      // Toast.show('请拖放完整')
      return
    }
    const correct =  answer.every((answerBg, idx) => {
      return dropList[idx] === answerBg
    })
    if (correct) {
      setVisible(true)
    } else {
      // 失败, 复位
      // Toast.show('答题错误')
      // reset()
      location.reload()
    }
  }
  /**
   * @description 置为初始状态
   */
  function reset() {
    setDropList(['', '', ''])
    setOptionList(['red', 'yellow', 'blue'])
  }
  function onTouchMove(e) {
    const {clientX, clientY} = e.touches[0]
    if (!dragBg) {
      setTouchXY(defaultXY)
    } else {
      setTouchXY([clientX, clientY])
    }
  }
  return (
    <MoveContext.Provider value={{
      touchXY
    }}>
    <div className={styles['move_block']} onTouchMove={onTouchMove}>
      <div className={styles['move_block-title']}>
        <div>仔细观察下面的规律，问号处依次是什么呢?</div>
        <div className={styles['move_block-title-reload']}><img src={reloadImg} alt=""/></div>
      </div>
      <BlockDrop assert={blockMap} dropList={dropList} />
      <div className={styles['move_block-drag']}>
        {createSelector()}
      </div>
      {/* 提交 */}
      <div className={styles['move_block-checker']} onClick={submit}></div>
      <ResultModal star={3} visible={visible} onClose={() => setVisible(false)} />
      {/* @ts-ignore */}
      <animated.div className={styles['animate-reset']} style={stylesProps}>
        <img src={blockMap[coverBg]} alt=""/>
      </animated.div>
      {/* 随着鼠标拖动的盒子 */}
      <div className={`${styles['move_block-drag_mask']}`} style={{
        left: `${touchXY[0]}px`,
        top: `${touchXY[1]}px`,
        // opacity: .3
      }}>
        <img src={blockMap[dragBg]}   />
      </div>
    </div>
    </MoveContext.Provider>
  )
}

export default MoveBlock
