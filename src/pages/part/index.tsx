
/**
 * @description 气球
 */
import React, { FC, useState, useEffect, useRef } from 'react';
import { session } from '@/utils/store';
import RewardModal from '@/components/rewardModal';
import useStage from '@/hooks/useStage';
import useReward from '@/hooks/useReward';
import useCreateEle, {
  ElesConfig,
  EleTypeEnums,
  EvtNameEnum,
} from '@/hooks/useCreateEle';
// const { Scene, Sprite, Gradient, Rect, Block, Label } = spritejs;
const [question] = [
  require('@/assets/part/question.png'),
];
const assertMap = {
  question,
}
const canvasId = 'part-container'
interface PropTypes {}
const sessionKey = 'optionPos';
const Part: FC<PropTypes> = function(props) {
  const {visible, setVisible, onClose} = useReward()
  const answer = 'blue'
  const { stage } = useStage({
    elId: canvasId,
  });
  const { elements, setEles, eles } = useCreateEle({
    stage,
  });
  useEffect(() => {
    initPage()
    return () => {
      return session.clear();
    };
  }, []);
  function initPage() {
    setEles([
      {
        type: EleTypeEnums.LABEL,
        option: {
          text: '哪个是机器人!',
          fontSize: 34,
          pos: [61, 93],
        },
      },
      {
        type: EleTypeEnums.SPRITE,
        option: {
          texture: question,
          pos: [469, 246.29],
          size: [85.57, 85.56]
        },
      },
      ...createOptionsBlock()
    ]);
  }
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

export default Part;
