/**
 * @description 页面描述
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
const assetsMap = {
  desk: require('./assets/桌子.png'),
  bear: require('./assets/png0018.png'),
  car: require('./assets/汽车.png'),
}
const canvasId = 'bearAndCar-container'
interface PropTypes {}
const sessionKey = 'optionPos';
const BearAndCar: FC<PropTypes> = function(props) {
  const {visible, setVisible, onClose} = useReward()
  const answer = 'blue'
  const { stage } = useStage({
    elId: canvasId,
  });
  const { elements, setEles, eles } = useCreateEle({
    stage,
  });
  const { createHorn, createQuestionLabel, createSubQuestionLabel } = useComponents()
  useEffect(() => {
    if (stage) {
      stage.layer.attr({
        bgcolor: '#FFF5EE'
      })
    }
  }, [stage])
  useEffect(() => {
    initPage()
    return () => {
      return session.clear();
    };
  }, []);
  function initPage() {
    setEles([
      createHorn(),
      createQuestionLabel('这里有很多玩具熊和玩具车，你想按照什么样的规律来'),
      createSubQuestionLabel('排列呢？试试看吧'),
      {
        type: EleTypeEnums.SPRITE,
        option: {
          texture: assetsMap.desk,
          pos: [68.1, 284.63],
          size: [887.81, 222.84]
        }
      },
      ...createBearAndCar()
    ]);
  }
  useEffect(() => {
    if (!Array.isArray(elements) || elements.length === 0) return;
  }, [elements]);
  function createBearAndCar() {
    const bw = 70.27, bh = 73, cw = 88, ch = 68;
    const bears = [['A','A','A'],['A','A','A']].map((list, i) => {
      const y = 588 + (9 + bh + bh / 2) * i
      return list.map((a, ai) => {
        const x = 61 + bw / 2 + (8 + bw) * ai
        return {
          type: EleTypeEnums.SPRITE,
          option: {
            name: a,
            anchor: [.5, .5],
            texture: assetsMap.bear,
            pos: [x, y],
            size: [bw, bh]
          },
          evt: [{
            type: EvtNameEnum.TOUCH_MOVE,
            callback: moveBear
          }]
        }
      })
    }).flat()
    const cars = [['B','B','B'],['B','B','B']].map((list, i) => {
      const y = 588 + (14 + ch + ch / 2) * i
      return list.map((b, bi) => {
        const x = 687 + cw / 2 + (8 + cw ) * bi
        return {
          type: EleTypeEnums.SPRITE,
          option: {
            name: b,
            anchor: [.5, .5],
            texture: assetsMap.car,
            pos: [x, y],
            size: [cw, ch]
          },
          evt: [{
            type: EvtNameEnum.TOUCH_MOVE,
            callback: moveCar
          }]
        }
      })
    }).flat()
    return [...bears, ...cars]
  }
  function moveBear(evt, elm) {
    elm.attr({
      pos: [evt.x, evt.y]
    })
  }
  function moveCar(evt, elm) {
    elm.attr({
      pos: [evt.x, evt.y]
    })
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
export default BearAndCar
