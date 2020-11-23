/**
 * @description 零件
 */
import React, { FC, useState, useEffect, useRef } from 'react';
import { session } from '@/utils/store';
import RewardModal from '@/components/rewardModal';
import useStage from '@/hooks/useStage';
import useReward from '@/hooks/useReward';
import useComponents from '@/hooks/useComponents';
import {main_color} from '@/utils/theme';
import useCreateEle, {
  ElesConfig,
  EleTypeEnums,
  EvtNameEnum,
} from '@/hooks/useCreateEle';
const assertMap = {
  red: require('@/assets/png0026.png'),
  yellow: require('@/assets/png0027.png'),
  blue: require('@/assets/png0028.png'),
};
const canvasId = 'blocks-container';
interface PropTypes {}
const sessionKey = 'optionPos';
const Blocks: FC<PropTypes> = function(props) {
  const { visible, setVisible, onClose } = useReward();
  const answer = 'blue';
  const { stage } = useStage({
    elId: canvasId,
  });
  const { elements, setEles, eles } = useCreateEle({
    stage,
  });
  const { createHorn, createOptionsBlock } = useComponents()
  useEffect(() => {
    initPage();
    return () => {
      return session.clear();
    };
  }, []);
  function initPage() {
    setEles([
      createHorn(),
      {
        type: EleTypeEnums.LABEL,
        option: {
          text: '仔细观察下面的规律，问号处依次是什么呢?',
          fontSize: 34,
          pos: [61, 93],
        },
      },
      ...createQuestionBlocks(),
      // 问题区
      ...createAnswerBlocks(),
      // 占位
      ...createOptionsBlock(3, 'none'),
      // 答题色块
      ...createOptionsColorBlock()
    ]);
  }
  /**
   * @description 题目
   */
  function createQuestionBlocks() {
    return ['yellow','red', 'blue','yellow','red', 'blue'].map((color, index) => {
      const w = 79, x = 69 + (w + 23) * index
      return {
        type: EleTypeEnums.SPRITE,
        option: {
          texture: assertMap[color],
          size: [w, 37],
          pos: [x , 281]
        }
      }
    })
  }
  /**
   * @description 答案区域
   */
  function createAnswerBlocks() {
    return new Array(3).fill(0).map(( _ , index) => {
      const w = 96, x = 674 + (w + 23) * index
      return {
        type: EleTypeEnums.BLOCK,
        option: {
          name: `answer-${index}`,
          size: [w, 58],
          pos: [x , 270],
          border: [2, main_color],
          borderDash: 2,
          borderRadius: 10
        }
      }
    })
  }
  /**
   * @description 创建需要拖拽的色块
   */
  function createOptionsColorBlock() {
    return ['red', 'yellow', 'blue'].map((color, index) => {
      const w = 79, h = 37, x = 280 + w / 2 + (w + 114) * index
      return {
        type: EleTypeEnums.SPRITE,
        option: {
          anchor: [.5, .5],
          name: `${color}`,
          size: [w, h],
          pos: [x, 500 + h / 2],
          texture: assertMap[color]
        },
        evt: [{
          type: EvtNameEnum.TOUCH_MOVE,
          callback: (evt, ele) => {
            ele.attr({
              pos: [evt.x, evt.y]
            })
          },
        }]
      }
    })
  }
  useEffect(() => {
    if (!Array.isArray(elements) || elements.length === 0) return;
  }, [elements]);
  return (
    <>
      <div
        id={canvasId}
        style={{
          width: '100vw',
          height: '100vh',
        }}
      />
      <RewardModal visible={visible} star={3} onClose={onClose} />
    </>
  );
};
export default Blocks;
