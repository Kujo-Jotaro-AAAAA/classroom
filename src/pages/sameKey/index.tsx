/**
 * @description 钥匙
 * TODO 背景颜色
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
import {success_color, fail_color} from '@/utils/theme';
import styles from './styles/index.less';
// const { Scene, Sprite, Gradient, Rect, Block, Label } = spritejs;
const keysImg = [
  require('@/assets/keys/1.png'),
  require('@/assets/keys/2.png'),
  require('@/assets/keys/3.png'),
  require('@/assets/keys/4.png'),
  require('@/assets/keys/5.png'),
];
const canvasId = 'same-key-container';
interface PropTypes {}
const sessionKey = 'optionPos';
const SameKey: FC<PropTypes> = function(props) {
  const { visible, setVisible, onClose } = useReward();
  const answerRef = useRef<number[]>([]);
  const answer = [0, 5]; // 正确答案
  const blockElmRef = useRef<any[]>([]);
  const { createHorn, createBlueBlock, createQuestionLabel } = useComponents();
  const { stage } = useStage({
    elId: canvasId,
  });
  const { elements, setEles, findElesByNames } = useCreateEle({
    stage,
  });
  useEffect(() => {
    initPage();
    return () => {
      return session.clear();
    };
  }, []);
  function initPage() {
    setEles([
      createHorn(),
      createQuestionLabel('哪两把钥匙是一模一样的呢?点点看吧'),
      ...createLayout(),
      ...createKeys(),
    ]);
  }
  useEffect(() => {
    if (!Array.isArray(elements) || elements.length === 0) return;
    blockElmRef.current = getBlocks();
    console.log('getBlocks ==>', blockElmRef.current);
  }, [elements]);
  function getBlocks() {
    const  blockNames = [0,1,2,3,4,5].map(num => `block-${num}`)
    return findElesByNames(elements, blockNames)
    // return elements.filter(el => {
    //   return el.name;
    // });
  }
  function createLayout() {
    const xs = [240, 433, 626],
      ys = [243, 457];
    const posList = ys
      .map(y => {
        return xs.map(x => {
          return [x, y];
        });
      })
      .flat();
    const blueBlockConfigs = createBlueBlock(posList, 'visible');
    return blueBlockConfigs.map((config, idx) => {
      config.option.name = `block-${idx}`;
      return {
        ...config,
        evt: [
          {
            type: EvtNameEnum.CLICK,
            callback: (evt, elm) => {
              onBlockClick(elm);
            },
          },
        ],
      };
    });
  }
  /**
   * @description 点击方块
   * @param elm
   */
  function onBlockClick(elm) {
    const [p, key] = elm.name.split('-');
    if (answerRef.current.length < 2) {
      answerRef.current.push(Number(key));
      const correct =
        answer.length === answerRef.current.length &&
        answer.every(a => answerRef.current.includes(a));
      if (correct) {
        handleCorrect();
      } else {
        if (answerRef.current.length === 2) { // 回答错误
          // 播放错误语音后,重置
          setTimeout(() => {
            resetBlockBg();
            answerRef.current = [];
          }, 3000);
        }
        elm.attributes.bgcolor = fail_color;
      }
    }
  }
  /**
   * @description 成功
   */
  function handleCorrect() {
    setVisible(true);
    answer.forEach(an => {
      blockElmRef.current[an].attr({
        bgcolor: success_color,
      });
    });
  }

  function createKeys(): ElesConfig[] {
    const xs = [293, 494, 681],
      ys = [249, 463];
    const posList = ys
      .map(y => {
        return xs.map(x => {
          return [x, y];
        });
      })
      .flat();
    const concatKeys = [...keysImg, keysImg[0]];
    return concatKeys.map((url, idx) => {
      return {
        type: EleTypeEnums.SPRITE,
        option: {
          texture: url,
          pos: posList[idx],
          size: [52, 111],
        },
      };
    });
  }
  /**
   * @description 重置block背景
   */
  function resetBlockBg() {
    blockElmRef.current.forEach(el => {
      el.removeAttribute('bgcolor');
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
      <RewardModal
        visible={visible}
        star={3}
        onClose={() => {
          resetBlockBg();
          onClose();
        }}
      />
    </>
  );
};
export default SameKey;
