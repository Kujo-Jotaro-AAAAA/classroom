/**
 * @description 页面描述
 */
import React, { FC, useState, useEffect, useRef } from 'react';
import { session } from '@/utils/store';
import RewardModal from '@/components/rewardModal';
import useStage from '@/hooks/useStage';
import useReward from '@/hooks/useReward';
import useComponents from '@/hooks/useComponents';
// import {SAVE_PICTURE} from '@/utils/bridge';
import { history } from 'umi';
import useCreateEle, {
  ElesConfig,
  EleTypeEnums,
  EvtNameEnum,
} from '@/hooks/useCreateEle';
export const bAndCResultSession = 'bAndCResultSession'; // 小朋友操作完的结果图像
const assetsMap = {
  desk: require('./assets/桌子.png'),
  bear: require('./assets/png0018.png'),
  car: require('./assets/汽车.png'),
  ellipse: require('./assets/椭圆形@2x.png'),
};
const canvasId = 'bearAndCar-container';
const replyPosSessionKey = 'replyPos'; // 回复椭圆框的点位
const replySessionKey = 'replyKeys'; // 回复信息 ['A', 'A']
const bearSessionKey = 'bear'; // 熊原始定位
const carSessionKey = 'car'; // 车原始定位

const BearAndCar: FC = function() {
  const {
      visible,
      setVisible,
      onClose,
      getSessionStar,
      addSessionReply,
    } = useReward(),
    ellipseRef = useRef<any[]>([]),
    optionRef = useRef<any>({
      bear: [],
      car: [],
    }),
    answerMap = {
      A: 'bear',
      B: 'car',
    };
  const answer = [
    // 答案
    'AAAAAA',
    'BBBBBB',
    'ABABAB',
    'BABABA',
    'AABAAB',
    'ABBABB',
    'BBABBA',
    'BAABAA',
    'ABAABA',
    'BABBAB',
  ];
  const { stage, toImage } = useStage({
    elId: canvasId,
  });
  const { elements, setEles, findElesByNames, commonAnimate } = useCreateEle({
    stage,
  });
  const {
    createHorn,
    createQuestionLabel,
    createSubQuestionLabel,
  } = useComponents();
  useEffect(() => {
    if (stage) {
      stage.layer.attr({
        bgcolor: '#FFF5EE',
      });
    }
  }, [stage]);
  useEffect(() => {
    initPage();
    return () => {
      session.removeKey(replyPosSessionKey);
      session.removeKey(replySessionKey);
      session.removeKey(bearSessionKey);
      session.removeKey(carSessionKey);
    };
  }, []);
  useEffect(() => {
    if (!Array.isArray(elements) || elements.length === 0) return;
    getReplyDefaultPos();
    getOptionDefaultPos();
  }, [elements]);
  function initPage() {
    setEles([
      createHorn(),
      createQuestionLabel('这里有很多玩具熊和玩具车，你想按照什么样的规律来'),
      createSubQuestionLabel('排列呢？试试看吧!'),
      {
        // 桌子
        type: EleTypeEnums.SPRITE,
        option: {
          texture: assetsMap.desk,
          pos: [68.1, 284.63],
          size: [887.81, 222.84],
        },
      },
      ...createBearAndCar(),
      ...createEllipse(),
    ]);
  }
  // 椭圆
  function getReplyDefaultPos() {
    ellipseRef.current = findElesByNames(elements, [
      'ellipse0',
      'ellipse1',
      'ellipse2',
      'ellipse3',
      'ellipse4',
      'ellipse5',
    ]);
  }
  /**
   * @description 获取熊和车的默认定位
   */
  function getOptionDefaultPos() {
    optionRef.current.bear = findElesByNames(elements, [
      'A-0',
      'A-1',
      'A-2',
      'A-3',
      'A-4',
      'A-5',
    ]);
    optionRef.current.car = findElesByNames(elements, [
      'B-0',
      'B-1',
      'B-2',
      'B-3',
      'B-4',
      'B-5',
    ]);
  }
  function createBearAndCar(): ElesConfig[] {
    const bw = 70.27,
      bh = 73,
      cw = 88,
      ch = 68;
    let bearIdx = 0;
    const bears = [
      ['A', 'A', 'A'],
      ['A', 'A', 'A'],
    ]
      .map((list, i) => {
        const y = 588 + (9 + bh + bh / 2) * i;
        return list.map((a, ai) => {
          const x = 61 + bw / 2 + (8 + bw) * ai;
          bearIdx++;
          return {
            type: EleTypeEnums.SPRITE,
            option: {
              name: `${a}-${bearIdx - 1}`,
              anchor: [0.5, 0.5],
              texture: assetsMap.bear,
              pos: [x, y],
              size: [bw, bh],
            },
            evt: [
              {
                type: EvtNameEnum.TOUCH_MOVE,
                callback: moveOption,
              },
              {
                type: EvtNameEnum.TOUCH_END,
                callback: moveEndOption,
              },
            ],
          };
        });
      })
      .flat();
    let carsIndex = 0;
    const cars = [
      ['B', 'B', 'B'],
      ['B', 'B', 'B'],
    ]
      .map((list, i) => {
        const y = 588 + (14 + ch + ch / 2) * i;
        return list.map((b, bi) => {
          carsIndex++;
          const x = 687 + cw / 2 + (8 + cw) * bi;
          return {
            type: EleTypeEnums.SPRITE,
            option: {
              name: `${b}-${carsIndex - 1}`,
              anchor: [0.5, 0.5],
              texture: assetsMap.car,
              pos: [x, y],
              size: [cw, ch],
            },
            evt: [
              {
                type: EvtNameEnum.TOUCH_MOVE,
                callback: moveOption,
              },
              {
                type: EvtNameEnum.TOUCH_END,
                callback: moveEndOption,
              },
            ],
          };
        });
      })
      .flat();
    session.setKey(
      bearSessionKey,
      bears.map(b => b.option.pos),
    );
    session.setKey(
      carSessionKey,
      cars.map(b => b.option.pos),
    );
    return [...bears, ...cars];
  }
  function createEllipse(): ElesConfig[] {
    const y = 308,
      w = 68,
      h = 8;
    const list = new Array(6).fill(6).map((ell, idx) => {
      const x = 145 + w / 2 + (63 + w) * idx;
      return {
        type: EleTypeEnums.SPRITE,
        option: {
          name: `ellipse${idx}`,
          texture: assetsMap.ellipse,
          anchor: [0.5, 0],
          pos: [x, y],
          size: [w, h],
        },
      };
    });
    const pointers = list.map(item => item.option.pos);
    session.setKey(replyPosSessionKey, pointers);
    return list;
  }

  function moveOption(evt, elm) {
    elm.attr({
      pos: [evt.x, evt.y],
    });
  }
  /**
   * @description 移动
   * @param evt
   * @param elm
   */
  function moveEndOption(evt, elm, { stage }) {
    const [tag, i] = elm.name.split('-');
    const defaultPos = session.getKey(replyPosSessionKey);
    let flag = false; // 是否有匹配点位
    defaultPos.forEach((pos, idx) => {
      const isCover = elm.isPointCollision(pos[0], pos[1]);
      if (isCover) {
        const repeat = isRepeatElm(elm);
        console.log('repeat', repeat);

        if (repeat) return
        flag = isCover;
        elm.animate(
          [
            {
              pos: [pos[0], pos[1] - 28],
              pointerEvents: 'none',
            },
          ],
          commonAnimate,
        );
        getSubmitInfo(tag, idx, stage);
        return;
      }
    });
    if (!flag) {
      // const getTag
      const keyType = answerMap[tag],
        pos = session.getKey(keyType)[i];
      elm.animate([{ pos }], commonAnimate);
    }
  }
  function isRepeatElm(elm) {
    let flag = false
    const optionElms = [...optionRef.current.bear, ...optionRef.current.car];
    const repeat = optionElms.find(eles => {
      if (eles.name !== elm.name) {
        const [x, y] = eles.attr().pos;
        return elm.isPointCollision(x, y);
      }
    });
      console.log('curr chongfu',repeat);
    if (repeat) {
      flag = true
      const bearPos = session.getKey(bearSessionKey);
      const carPos = session.getKey(carSessionKey);
      const posMap = {
        bear: bearPos,
        car: carPos,
      };
      // [...optionRef.current.bear, ...optionRef.current.car].forEach(sprite => {
      const [tag, index] = elm.name.split('-');
      const pos = posMap[answerMap[tag]][index];
      elm.animate(
        [
          {
            pos,
            pointerEvents: 'visible',
          },
        ],
        commonAnimate,
      );
    }
    return flag
  }
  /**
   * @description 提交信息
   */
  function getSubmitInfo(tag, idx, stage) {
    const curr = session.getKey(replySessionKey) || new Array(6).fill('');
    curr[idx] = tag;
    session.setKey(replySessionKey, curr);
    const canSubmit = curr.every(ans => Boolean(ans)); // 答题完成
    if (canSubmit) {
      submit(curr, stage);
    }
  }
  /**
   * @description 提交当前答案
   * @param curr
   */
  function submit(curr, stage) {
    const isCorrect = answer.some(ans => ans === curr.join(''));
    if (isCorrect) {
      setTimeout(() => {
        savePageSnapshot(stage);
        setVisible(true);
        setTimeout(() => {
          history.push('/bearandcar/record');
        }, 2000);
      }, 1200);
      return;
    }
    resetOptionPos();
    addSessionReply();
  }
  /**
   * @description 重置
   * 错误，计数+1
   */
  function resetOptionPos() {
    const bearPos = session.getKey(bearSessionKey);
    const carPos = session.getKey(carSessionKey);
    const posMap = {
      bear: bearPos,
      car: carPos,
    };
    [...optionRef.current.bear, ...optionRef.current.car].forEach(sprite => {
      const [tag, index] = sprite.name.split('-');
      const pos = posMap[answerMap[tag]][index];
      sprite.animate(
        [
          {
            pos,
            pointerEvents: 'visible',
          },
        ],
        commonAnimate,
      );
    });
    session.removeKey(replySessionKey);
  }
  /**
   * @description 将当前页面的图像保存到session
   */
  function savePageSnapshot(stage) {
    session.setKey(bAndCResultSession, toImage(stage.scene));
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
        needNextStep={false}
        star={getSessionStar()}
        onClose={onClose}
      />
    </>
  );
};
export default BearAndCar;
