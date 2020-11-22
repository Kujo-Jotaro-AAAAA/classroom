/**
 * @description 手套
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
import useComponents from '@/hooks/useComponents';
// const { Scene, Sprite, Gradient, Rect, Block, Label } = spritejs;
const [first, center, last] = [
  require('@/assets/glove/first.png'),
  require('@/assets/glove/center.png'),
  require('@/assets/glove/last.png'),
];
const assertMap = {
  first,
  center,
  last
}
const { createOptionsBlock } = useComponents()
const canvasId = 'part-container'
interface PropTypes {}
const sessionKey = 'optionPos';
const Part: FC<PropTypes> = function(props) {
  const {visible, setVisible, onClose} = useReward()
  const answer = 'center'
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
          text: '哪个是和上面的手套一模一样的呢？点点看吧',
          fontSize: 34,
          pos: [61, 93],
        },
      },
      {
        type: EleTypeEnums.SPRITE,
        option: {
          texture: center,
          pos: [469, 251],
          size: [86.88, 84.25]
        },
      },
      // 选项区
      ...createOptionsGloves(),
      ...createOptionsBlock(3)
    ]);
  }

/**
   * @description 选项区
   */
  function createOptionsGloves(): ElesConfig[] {
    const arr = ['first', 'center', 'last'];
    // colorMap
    const gloves = arr.map((imgKey, idx) => {
      const balloonW = 86.88;
      const initPosX = 263;
      const initPosY = 477;
      return {
        type: EleTypeEnums.SPRITE,
        option: {
          name: imgKey,
          texture: assertMap[imgKey],
          size: [balloonW, 84.25],
          // anchor: [0.5, 0.5],
          zIndex: 200,
          pos: [initPosX + (103 + balloonW) * idx, initPosY],
        },
        evt: [
          {
            type: EvtNameEnum.CLICK,
            callback: (evt, el) => {
              if (answer === el.name) {
                setVisible(true)
              } else {
                console.log('答错了')
                // initPage()
                // location.reload()
              }
            }
          }
        ]
      };
    });
    return gloves;
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

