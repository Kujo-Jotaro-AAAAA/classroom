/**
 * @description 封装常见canvas项配置
 */
import { useState, useEffect, useRef } from 'react';
import { ElesConfig, EleTypeEnums, EvtNameEnum } from '@/hooks/useCreateEle';
import { main_color } from '@/utils/theme';
const [reloadHorn] = [require('@/assets/重播按钮.png')];
interface PropTypes {}

export default function useComponents() {
  const commonBlock = 'commonBlock';
  /**
   * @description 喇叭
   */
  function createHorn(): ElesConfig {
    return {
      type: EleTypeEnums.SPRITE,
      option: {
        texture: reloadHorn,
        pos: [922, 99],
        size: [41.86, 35.33],
      },
    };
  }
  /**
   * @description 题干
   * @param text 问题
   */
  function createQuestionLabel(text: string): ElesConfig {
    return {
      type: EleTypeEnums.LABEL,
      option: {
        text,
        fontSize: 34,
        pos: [61, 93],
      },
    };
  }
  /**
   * @description 通用蓝框盒子
   * @param posList
   */
  function createBlueBlock(
    posList: number[][],
    pointerEvents: string = 'visible',
  ): ElesConfig[] {
    return posList.map((pos, idx) => {
      const boxW = 158;
      return {
        type: EleTypeEnums.BLOCK,
        option: {
          name: `${commonBlock}-${idx}`,
          size: [boxW, 123],
          pos,
          border: [2, main_color],
          pointerEvents, // 此属性要指给不捕获事件的元素
          borderRadius: 10,
        },
      };
    });
  }
  /**
   * @description 生成单排的选项框
   * @param num
   */
  function createOptionsBlock(num: number, pointerEvents: string = 'visible'): ElesConfig[] {
    const initPosX = 232,
      initPosY = 457,
      w = 158,
      h = 123;
    const arr = new Array(num).fill(0).map((_, idx) => {
      return [initPosX + (w + 35) * idx, initPosY];
    });
    return createBlueBlock(arr, pointerEvents);
  }
  /**
   * @description 生成两排的选项框
   * @param num
   */
  function createDoubleOptionsBlock(pointerEvents: string = 'visible'): ElesConfig[] {
    const xs = [240, 433, 626],
      ys = [243, 457];
    const posList = ys
      .map(y => {
        return xs.map(x => {
          return [x, y];
        });
      })
      .flat();
    return createBlueBlock(posList, pointerEvents);
  }

  return {
    createHorn,
    createQuestionLabel,
    createOptionsBlock,
    createDoubleOptionsBlock,
    commonBlock,
    createBlueBlock,
  };
}
