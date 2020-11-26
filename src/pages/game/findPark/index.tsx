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
import Layout from './layout';
import { Sprite } from 'spritejs';
const canvasId = 'FindPark-container';
const assetsMap = {
  glass: require('./assets/出题区杯子.png'),
  rbt: require('./assets/出题区喷泉兔子备份.png'),
  car: require('./assets/出题区车备份.png'),
  eleph: require('./assets/出题区大象备份.png'),
  kite: require('./assets/出题区风筝备份.png'),
  bg: require('./assets/bg.png'),
  magnifier: require('./assets/放大镜.png'),
  mask: require('./assets/形状结合.png'),
};
interface PropTypes {}
const sessionKey = 'optionPos';
const FindPark: FC<PropTypes> = function(props) {
  const { visible, setVisible, onClose } = useReward();
  const { createQuestionLabel, createHorn } = useComponents();
  const { stage } = useStage({
    elId: canvasId,
  });
  const { elements, setEles, findElesByNames } = useCreateEle({
    stage,
  });
  const maskRef = useRef<any[]>();
  const [reply, setReply] = useState<string[]>([]); // 答题
  const answer = ['glass', 'rbt', 'car', 'eleph', 'kite']; // 答案
  useEffect(() => {
    renderPage();
    return () => {
      return session.clear();
    };
  }, []);
  useEffect(() => {
    if (!Array.isArray(elements) || elements.length === 0) return;
    maskRef.current = findElesByNames(elements, [
      'mask',
      'tip'
      // 'tip-glass',
      // 'tip-rbt',
      // 'tip-car',
      // 'tip-eleph',
      // 'tip-kite',
    ]);
  }, [elements]);
  function renderPage() {
    setEles([
      createHorn(),
      createQuestionLabel('今天你是小小侦探噢，请在游乐园中找到画圈的事务，'),
      ...Layout(assetsMap),
      {
        type: EleTypeEnums.SPRITE,
        option: {
          texture: assetsMap.magnifier,
          size: [43.76, 49.78],
          pos: [921, 192],
        },
        evt: [
          {
            type: EvtNameEnum.CLICK,
            callback: (evt, elm) => {
              magClick(elm);
            },
          },
        ],
      },
      {
        type: EleTypeEnums.BLOCK,
        option: {
          name: 'mask',
          size: [1024, 515],
          pos: [0, 253],
          bgcolor: 'rgba(89, 132, 138, .45)',
          zIndex: 1
        },
        evt: [{
          type: EvtNameEnum.CLICK,
          callback: () => {
            hideMask()
          }
        }]
      },
      // createSourceRect(),
    ]);
  }
  function createSourceRect() {
    const sourceMap = {
      glass: {
        pos: [348, 336], // 椭圆的位置,
        sourceRect: [348, 83, 500, 268], // 裁剪的位置
      },
      rbt: {
        pos: [556, 336],
        sourceRect: [348, 83, 500, 268], // 裁剪的位置
      },
      car: {
        pos: [348, 700],
        sourceRect: [348, 83, 500, 268], // 裁剪的位置
      },
      eleph: {
        pos: [200, 500],
        sourceRect: [348, 83, 500, 268], // 裁剪的位置
      },
      kite: {
        pos: [320, 400],
        sourceRect: [348, 83, 500, 268], // 裁剪的位置
      },
    };

    const unChioces = Object.keys(sourceMap).filter(k => !reply.includes(k)); // 过滤掉已选中
    const randomIdx = Math.floor(Math.random() * unChioces.length)
    console.log('randomIdx', randomIdx);
    const source = sourceMap[unChioces[randomIdx]]
    // return unChioces.map(unKey => {
      return {
        type: EleTypeEnums.SPRITE,
        option: {
          name: `tip`,
          texture: assetsMap.bg,
          ...source,
          size: [400, 160],
          anchor: [0.5, 0.5],
          // sourceRect: [348, 83, 500, 268],
          borderRadius: 200,
          zIndex: 2,
        },
        evt: [{
          type: EvtNameEnum.CLICK,
          callback: () => {
            hideMask()
          }
        }]
      };
    // });
  }
  function hideMask() {
    maskRef.current.forEach((mask, idx) => {
      mask.attr({
        zIndex: -(1 + idx)
      })
    })
  }
  function magClick(elm) {
    maskRef.current.forEach((mask, idx) => {
      mask.attr({
        zIndex: 10 + idx
      })
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
export default FindPark;
