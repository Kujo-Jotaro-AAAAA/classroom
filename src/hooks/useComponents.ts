/**
 * @description 封装常见canvas项配置
 */
import { useState, useEffect, useRef } from 'react'
import {
  ElesConfig,
  EleTypeEnums,
  EvtNameEnum,
} from '@/hooks/useCreateEle';
const [reloadHorn] = [require('@/assets/重播按钮.png')]
interface PropTypes {
}
export default function useComponents() {
  /**
   * @description 喇叭
   */
  function createHorn():ElesConfig {
    return {
      type: EleTypeEnums.SPRITE,
      option: {
        texture: reloadHorn,
        pos: [922, 99],
        size: [41.86, 35.33]
      }
    }
  }
  /**
   * @description 题干
   * @param text
   */
  function createQuestionLabel(text: string): ElesConfig {
    return {
      type: EleTypeEnums.LABEL,
      option: {
        text,
        fontSize: 34,
        pos: [61, 93],
      },
    }
  }
  /**
   * @description 通用蓝框盒子
   * @param posList
   */
  function createBlueBlock(posList: number[][], pointerEvents = 'none'): ElesConfig[] {
    return posList.map((pos) => {
      const boxW = 158;
      return {
        type: EleTypeEnums.BLOCK,
        option: {
          size: [boxW, 123],
          pos,
          border: [2, '#759AFF'],
          pointerEvents, // 此属性要指给不捕获事件的元素
          borderRadius: 10,
        },
      };
    });
  }
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
    createHorn,
    createQuestionLabel,
    createOptionsBlock,
    createBlueBlock
  }
}
