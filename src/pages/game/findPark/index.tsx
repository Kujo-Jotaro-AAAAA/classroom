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
      // 'tip',
      // 'tip-glass',
      // 'tip-rbt',
      // 'tip-car',
      // 'tip-eleph',
      // 'tip-kite',
    ]);
    console.log('maskRef.current', maskRef.current);
  }, [elements]);
  function renderPage() {
    setEles([
      createHorn(),
      createQuestionLabel('今天你是小小侦探噢，请在游乐园中找到画圈的事务，'),
      ...Layout(assetsMap),
      {
        // 放大镜
        type: EleTypeEnums.SPRITE,
        option: {
          texture: assetsMap.magnifier,
          size: [43.76, 49.78],
          pos: [921 + 43.76 / 2, 192 + 49.78 / 2],
          anchor: [0.5, 0.5],
        },
        evt: [
          {
            type: EvtNameEnum.CLICK,
            callback: (evt, elm) => {
              magClick(elm);
            },
          },
        ],
        animates: [
          {
            animate: [
              {
                scale: [1.25, 1.25],
              },
              {
                scale: [1, 1],
              },
            ],
            config: {
              delay: 30000,
              duration: 500,
              easing: 'ease-in',
              direction: 'alternate',
              iterations: 2,
              fill: 'none',
            },
          },
        ],
      },
      // {
      //   type: EleTypeEnums.BLOCK,
      //   option: {
      //     name: 'mask',
      //     size: [1024, 515],
      //     pos: [0, 253],
      //     bgcolor: 'rgba(89, 132, 138, .45)',
      //     zIndex: 1
      //   },
      //   evt: [{
      //     type: EvtNameEnum.CLICK,
      //     callback: () => {
      //       hideMask()
      //     }
      //   }]
      // },
      // createSourceRect(),
    ]);
  }
  function createMaskAndTip() {
    setEles([
      {
        type: EleTypeEnums.BLOCK,
        option: {
          name: 'mask',
          size: [1024, 515],
          pos: [0, 253],
          bgcolor: 'rgba(89, 132, 138, .45)',
          zIndex: 1,
        },
        evt: [
          {
            type: EvtNameEnum.CLICK,
            callback: () => {
              hideMask();
            },
          },
        ],
      },
      ...createSourceRect(),
    ]);
  }
  function createSourceRect() {
    const w = 374,
        h = 190;
    const test = [28, 328, 28 + w, 328 + h]
    const sourceMap = {
      glass: {
        pos: [268, 253 + 2], // 椭圆的位置,
        sourceRect: test, // 裁剪的位置
      },
      rbt: {
        pos: [1, 137 + 253],
        sourceRect: test, // 裁剪的位置
      },
      car: {
        pos: [364, 440],
        sourceRect: test, // 裁剪的位置
      },
      eleph: {
        pos: [28, 328 + 253],
        sourceRect: test, // 裁剪的位置
      },
      kite: {
        pos: [648, 312 + 253],
        sourceRect: test, // 裁剪的位置
      },
    };
    const unChioces = Object.keys(sourceMap).filter(k => !reply.includes(k)); // 过滤掉已选中
    const randomIdx = Math.floor(Math.random() * unChioces.length);
    const source = sourceMap[unChioces[randomIdx]];
    // 选中一个提示
    return [unChioces[randomIdx]].map((unKey, idx) => {

      source.pos = [source.pos[0] + w / 2, source.pos[1] + h / 2];
      return {
        type: EleTypeEnums.SPRITE,
        option: {
          name: `tip-${unKey}`,
          texture: assetsMap.bg,
          anchor: [0.5, 0.5],
          ...source,
          size: [w, h],
          pointerEvents: 'none',
          borderRadius: [w / 2, h / 2],
          zIndex: 2,
        },
        evt: [
          {
            type: EvtNameEnum.CLICK,
            callback: (evt, elm) => {
              hideMask();
            },
          },
        ],
      };
    });
  }
  function hideMask() {
    maskRef.current.forEach((mask, idx) => {
      mask.attr({
        zIndex: -(1 + idx),
      });
    });
  }
  function magClick(elm) {
    createMaskAndTip();
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
