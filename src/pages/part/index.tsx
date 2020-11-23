/**
 * @description 零件
 */
import React, { FC, useState, useEffect, useRef } from 'react';
import { session } from '@/utils/store';
import RewardModal from '@/components/rewardModal';
import useStage from '@/hooks/useStage';
import useReward from '@/hooks/useReward';
import { success_color, fail_color } from '@/utils/theme';
import useCreateEle, {
  ElesConfig,
  EleTypeEnums,
  EvtNameEnum,
  EleEventTypes,
} from '@/hooks/useCreateEle';
import useComponents from '@/hooks/useComponents';
// const { Scene, Sprite, Gradient, Rect, Block, Label } = spritejs;
const [question, first, center, last] = [
  require('@/assets/part/question.png'),
  require('@/assets/part/first.png'),
  require('@/assets/part/center.png'),
  require('@/assets/part/last.png'),
];
const assertMap = {
  first,
  center,
  last,
};
const canvasId = 'part-container';
interface PropTypes {}
const sessionKey = 'optionPos';
const Part: FC<PropTypes> = function(props) {
  const { createOptionsBlock, commonBlock } = useComponents();
  const { visible, setVisible, onClose } = useReward();
  const answer = `${commonBlock}-0`;
  const optionElms = useRef([]);
  const { stage } = useStage({
    elId: canvasId,
  });
  const { elements, setEles, resetElmsAttr, payloadEvtsByNames } = useCreateEle(
    {
      stage,
    },
  );
  useEffect(() => {
    initPage();
    return () => {
      return session.clear();
    };
  }, []);
  function initPage() {
    setEles([
      {
        type: EleTypeEnums.LABEL,
        option: {
          text: '哪个是和机器人零件一模一样的呢？点点看吧',
          fontSize: 34,
          pos: [61, 93],
        },
      },
      {
        type: EleTypeEnums.SPRITE,
        option: {
          texture: question,
          pos: [469, 246.29],
          size: [85.57, 85.56],
        },
      },
      // 选项区
      ...createOptionsParts(),
      ...createOptionsBlock(3),
    ]);
  }

  /**
   * @description 选项区
   */
  function createOptionsParts(): ElesConfig[] {
    const arr = ['first', 'center', 'last'];
    // colorMap
    const parts = arr.map((imgKey, idx) => {
      const balloonW = 85.56;
      const initPosX = 268 + balloonW / 2;
      const initPosY = 476;
      return {
        type: EleTypeEnums.SPRITE,
        option: {
          name: imgKey,
          texture: assertMap[imgKey],
          size: [balloonW, 85.58],
          anchor: [0.5, 0.5],
          zIndex: 200,
          pointerEvents: 'none',
          pos: [initPosX + (107 + balloonW) * idx, initPosY + 85.58 / 2],
        },
      };
    });
    return parts;
  }
  useEffect(() => {
    if (!Array.isArray(elements) || elements.length === 0) return;
    const blocks = [0, 1, 2].map(n => `${commonBlock}-${n}`);
    // const ref = findElesByNames(elements, blocks)
    optionElms.current = payloadEvtsByNames(elements, blocks, [
      {
        type: EvtNameEnum.CLICK,
        callback: (evt, el) => {
          onSubmit(el);
        },
      },
    ]);
    // console.log('ref ==>', ref);
  }, [elements]);
  function onSubmit(el) {
    const correct = el.name === answer;
    const bgcolorStatus = correct ? success_color : fail_color;
    if (correct) {
      setVisible(true);
    } else {
      // TODO 播放，重置
      setTimeout(() => {
        resetElmsAttr(elements, ['bgcolor']);
      }, 1000);
    }
    el.attr({
      bgcolor: bgcolorStatus,
    });
  }
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
