/**
 * @description 零件
 */
import React, { FC, useState, useEffect, useRef } from 'react';
import { session } from '@/utils/store';
import RewardModal from '@/components/rewardModal';
import useStage from '@/hooks/useStage';
import useReward from '@/hooks/useReward';
import useComponents from '@/hooks/useComponents';
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
const canvasId = 'same-key-container'
interface PropTypes {}
const sessionKey = 'optionPos';
const SameKey: FC<PropTypes> = function(props) {
  const {visible, setVisible, onClose} = useReward()
  const { createBlueBlock, createQuestionLabel} = useComponents()
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
  function createLayout() {
    const xs = [240, 433, 626], ys = [243, 457]
    const posList = xs.map(x => {
      return ys.map(y => {
        return [x, y]
      })
    }).flat()
    return createBlueBlock(posList)
  }
  function initPage() {

    setEles([
      createQuestionLabel('哪两把钥匙是一模一样的呢?点点看吧'),
      {
        type: EleTypeEnums.SPRITE,
        option: {
          texture: question,
          pos: [469, 246.29],
          size: [85.57, 85.56]
        },
      },
      ...createLayout()
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
export default SameKey
