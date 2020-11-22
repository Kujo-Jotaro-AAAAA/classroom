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
export default function useComponents() {
  /**
   * @description 生成选项框
   * @param num
   */
  function createOptionsBlock(num: number): ElesConfig[] {
    const arr = new Array(num).fill(0)
    return arr.map((_, idx) => {
      const initPosX = 232;
      const initPosY = 457;
      const boxW = 158;
      return {
        type: EleTypeEnums.BLOCK,
        option: {
          size: [boxW, 123],
          pos: [initPosX + (boxW + 35) * idx, initPosY],
          border: [2, '#759AFF'],
          pointerEvents: 'none', // 此属性要指给不捕获事件的元素
          borderRadius: 10,
        },
      };
    });
  }
  return {
    createOptionsBlock
  }
}
