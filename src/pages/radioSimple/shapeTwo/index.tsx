/**
 * @description 页面描述
 */
import React, { FC, useState, useEffect, useRef } from 'react';
import { session } from '@/utils/store';
import RewardModal from '@/components/rewardModal';
import useStage from '@/hooks/useStage';
import useReward from '@/hooks/useReward';
import { history } from 'umi';
import useComponents from '@/hooks/useComponents';
import useCreateEle, {
  ElesConfig,
  EleTypeEnums,
  EvtNameEnum,
} from '@/hooks/useCreateEle';
import { main_color, success_color, success_border, fail_color } from '@/utils/theme';
const queryTmp = history.location.query.tmp;
const canvasId = 'shapeTwo-container';
const assetsMap = {
  finger: {
    fist: require('@/assets/shapeTwo/png0003.png'), // ✊
    cloth: require('@/assets/shapeTwo/png0004.png'), // 布
    scissors: require('@/assets/shapeTwo/png0009.png'), // ✂️
  },
  doughnut: {
    0: require('@/assets/shapeTwo/png0032.png'),
    1: require('@/assets/shapeTwo/png0033.png'),
  },
};

interface PropTypes {}
const sessionKey = 'optionPos';
const ShapeTwo: FC<PropTypes> = function(props) {
  const { visible, setVisible, onClose, setSessionReply, getStarFn, getSessionReply } = useReward();
  const fgW = 60.44,
    fgH = 64.95,
    answerMap = {
      finger: 1,
      doughnut: 0,
    },blockRef = useRef<any[]>()

  const { stage } = useStage({
    elId: canvasId,
  });
  const { elements, setEles, eles, findElesByNames, resetElmsAttr } = useCreateEle({
    stage,
  });
  const { createQuestionLabel, createHorn } = useComponents();
  useEffect(() => {
    initPage();
    return () => {
      return session.clear();
    };
  }, []);
  useEffect(() => {
    if (!Array.isArray(elements) || elements.length === 0) return;
    blockRef.current = findElesByNames(elements, ['0', '1'])
  }, [elements]);

  function initPage() {
    setEles([
      createQuestionLabel('是哪一种规律呢？点点看吧'),
      createHorn(),
      ...mapTmpOption(),
      ...createBlock(),
    ]);
  }
  function mapTmpOption(): ElesConfig[] {
    return createFinger();
  }
  function createFinger(): ElesConfig[] {
    const posX = 61,
      posY = 249,
      list = [
        'fist',
        'fist',
        'cloth',
        'fist',
        'fist',
        'cloth',
        'fist',
        'fist',
        'cloth',
      ],
      replyList = [
        ['fist', 'cloth'],
        ['fist', 'fist', 'cloth']
      ];
    const fgReplys = replyList
      .map((replys, reIdx) => {
        const replyPosX = {
          0: 294,
          1: 570,
        };
        return replys.map((key, idx) => {
          // console.log('key', assetsMap.finger[key]);
          const currPosx = replyPosX[reIdx] + (4 + fgW) * idx;
          return {
            type: EleTypeEnums.SPRITE,
            option: {
              texture: assetsMap.finger[key],
              size: [fgW, fgH],
              pos: [currPosx, 486],
              zIndex: 1,
              pointerEvent: 'none'
            },
            evt: [{
              type: EvtNameEnum.CLICK,
              callback: (evt, elm) => {
                const currBlock = blockRef.current.find(b => b.name === `${reIdx}`)
                handleBlockClick(currBlock)
              }
            }]
          };
        });
      })
      .flat();
    const fgList = list.map((key, idx) => {
      const currPosx = posX + (45 + fgW) * idx;
      return {
        type: EleTypeEnums.SPRITE,
        option: {
          texture: assetsMap.finger[key],
          size: [fgW, fgH],
          pos: [currPosx, posY],
        },
      };
    });
    return [...fgList, ...fgReplys];
  }
  function createBlock(): ElesConfig[] {
    const posX = [241, 548],
      posY = 457;
    return posX.map((x, idx) => {
      return {
        type: EleTypeEnums.BLOCK,
        option: {
          name: `${idx}`,
          pos: [x, posY],
          size: [235, 123],
          border: [2, main_color],
          borderRadius: 10,
        },
        evt: [
          {
            type: EvtNameEnum.CLICK,
            callback: (evt, elm) => {
              handleBlockClick(elm);
            },
          },
        ],
      };
    });
  }
  function handleBlockClick(elm) {
    const currAnswer = answerMap[queryTmp]
    if (elm.name == currAnswer) {
      elm.attr({
        borderColor: success_border,
        bgcolor: success_color
      })
      setVisible(true)
    } else {
      setSessionReply(getSessionReply() + 1)
      elm.attr({
        // borderColor: success_border,
        bgcolor: fail_color
      })
      setTimeout(() => {
        resetElmsAttr([elm], ['bgcolor'])
      }, 1000)
    }
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
      <RewardModal visible={visible} star={getStarFn(getSessionReply())} onClose={onClose} />
    </>
  );
};
export default ShapeTwo;
