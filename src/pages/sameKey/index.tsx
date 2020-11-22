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
const keysImg = [
  require('@/assets/keys/1.png'),
  require('@/assets/keys/2.png'),
  require('@/assets/keys/3.png'),
  require('@/assets/keys/4.png'),
  require('@/assets/keys/5.png'),
];
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
  const { elements, setEles, eles, createSprite } = useCreateEle({
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
  useEffect(() => {
    console.log('llll', eles);

  }, [eles])
  function initPage() {
    setEles([
      createQuestionLabel('哪两把钥匙是一模一样的呢?点点看吧'),
      ...createLayout(),
      ...createKeys()
    ]);
  }
  function createKeys(): ElesConfig[] {
    const xs = [293, 494, 681], ys = [249, 463]
    const posList = xs.map(x => {
      return ys.map(y => {
        return [x, y]
      })
    }).flat()
    const concatKeys = [...keysImg, keysImg[0]]
    return concatKeys.map((url, idx) => {
      return {
        type: EleTypeEnums.SPRITE,
        option: {
          texture: url,
          pos: posList[idx],
          size: [52, 111]
        }
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
