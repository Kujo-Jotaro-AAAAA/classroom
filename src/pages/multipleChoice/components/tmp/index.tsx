/**
 * @description 钥匙
 * TODO 背景颜色
 */
import React, { FC, useState, useEffect, useRef } from 'react';
import { session } from '@/utils/store';
import RewardModal from '@/components/rewardModal';
import useStage from '@/hooks/useStage';
import useReward from '@/hooks/useReward';
import { history } from 'umi';
import useComponents from '@/hooks/useComponents';
import { PageOptionItemTypes } from '../../index';
import useCreateEle, {
  ElesConfig,
  EleTypeEnums,
  EvtNameEnum,
} from '@/hooks/useCreateEle';
import { success_color, fail_color, success_border } from '@/utils/theme';
const keysImg = [
  require('@/assets/keys/1.png'),
  require('@/assets/keys/2.png'),
  require('@/assets/keys/3.png'),
  require('@/assets/keys/4.png'),
  require('@/assets/keys/5.png'),
];
const canvasId = 'same-key-container';

interface PropTypes extends PageOptionItemTypes {}
const sessionKey = 'optionPos';
const MultipleTmp: FC<PropTypes> = function({
  answer,
  optionElmInit,
  pushState,
}) {
  const {
    visible,
    setVisible,
    onClose,
    addSessionReply,
    getSessionStar,
  } = useReward();
  const answerRef = useRef<number[]>([]);
  const blockElmRef = useRef<any[]>([]);
  const {
    createHorn,
    commonBlock,
    createQuestionLabel,
    createDoubleOptionsBlock,
    createStep,
  } = useComponents();
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
      ...createStep(1),
      createHorn(),
      // createQuestionLabel('哪两把钥匙是一模一样的呢?点点看吧'),
      ...createOptions(),
      ...optionElmInit,
      // ...createKeys(),
    ]);
  }
  useEffect(() => {
    if (!Array.isArray(elements) || elements.length === 0) return;
    blockElmRef.current = getBlocks();
    console.log('getBlocks ==>', blockElmRef.current);
  }, [elements]);
  function getBlocks() {
    const blockNames = [0, 1, 2, 3, 4, 5].map(num => `${commonBlock}-${num}`);
    return findElesByNames(elements, blockNames);
  }
  function createOptions() {
    const blueBlockConfigs = createDoubleOptionsBlock();
    return blueBlockConfigs.map((config, idx) => {
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
      console.log({
        correct,
        answerRef: answerRef.current,
        answer,
      });

      if (correct) {
        handleCorrect();
      } else {
        if (answerRef.current.length === 2) {
          // 回答错误
          // 播放错误语音后,重置
          addSessionReply();
          setTimeout(() => {
            resetBlockBg();
            answerRef.current = [];
          }, 1000);
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
        borderColor: success_border,
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
        needNextStep={!Boolean(pushState)}
        star={getSessionStar()}
        onClose={() => {
          resetBlockBg();
          onClose();
          if (pushState) {
            history.push(pushState)
            location.reload()
          }

        }}
      />
    </>
  );
};
export default MultipleTmp;
