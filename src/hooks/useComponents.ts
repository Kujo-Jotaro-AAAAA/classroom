/**
 * @description 封装常见canvas项配置
 */
import { useState, useEffect, useRef } from 'react'
import {
  ElesConfig,
  EleTypeEnums,
  EvtNameEnum,
} from '@/hooks/useCreateEle';
interface PropTypes {
}
export default function useReward() {
  function createOptionsBlock() {
    const arr = [[240, 457]]
    return arr.map(pos => {
      return {
        type: EleTypeEnums.BLOCK,
        option: {
          pos: pos,
          size: [158, 123],
          border: [2, '#759AFF'],
          pointerEvents: 'none', // 此属性要指给不捕获事件的元素
          borderRadius: 10,
        },
      }
    })
  }
  return {
    createOptionsBlock
  }
}
