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
import {SHOW_TOAST} from '@/utils/bridge';
const canvasId = 'FindPark-container';
const assetsMap = {
  glass: require('./assets/游泳池@2x.png'),
  rbt: require('./assets/出题区喷泉兔子备份.png'),
  car: require('./assets/出题区车备份.png'),
  eleph: require('./assets/出题区大象备份.png'),
  kite: require('./assets/熊猫@2x.png'),
  bg: require('./assets/bg.png'),
  magnifier: require('./assets/放大镜.png'),
};
interface PropTypes {}
const sessionKey = 'optionPos';
const FindPark: FC<PropTypes> = function(props) {
  const { visible, setVisible, onClose, getSessionStar } = useReward();
  const { createQuestionLabel, createHorn } = useComponents();
  const { stage } = useStage({
    elId: canvasId,
  });
  const { elements, setEles, findElesByNames, findNameByLayer } = useCreateEle({
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
    maskRef.current = findMaskElm(elements);
  }, [elements]);
  /**
   * @description 获取遮罩及追光元素
   */
  function findMaskElm(elms) {
    return findElesByNames(elms, [
      'mask',
      'tip-glass',
      'tip-rbt',
      'tip-car',
      'tip-eleph',
      'tip-kite',
    ]).filter(item => Boolean(item));
  }
  function renderPage() {
    setEles([
      createHorn(),
      createQuestionLabel('今天你是小侦探噢，请在游乐园中点出圆圈里的事物'),
      ...Layout(assetsMap),
      {
        // 放大镜
        type: EleTypeEnums.SPRITE,
        option: {
          texture: assetsMap.magnifier,
          size: [43.76, 49.78],
          pos: [921 + 43.76 / 2, 167 + 49.78 / 2],
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
              {
                scale: [1.25, 1.25],
              },
              {
                scale: [1, 1],
              },
            ],
            config: {
              delay: 30000,
              duration: 800,
              easing: 'ease-in',
              direction: 'alternate',
              iterations: 1,
              fill: 'none',
            },
          },
        ],
      },
      ...createReply(),
    ]);
  }
  /**
   * @description 生成遮罩
   */
  function createMaskAndTip() {
    // findElesByNames
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
              hideMask(elements);
            },
          },
        ],
      },
      ...createSourceRect(),
    ]);
  }
  /**
   * @description 生成页面上的追光提示
   */
  function createSourceRect() {
    const w = 374,
      h = 190;
    const doubtSize = [w * 2, h * 2]; // 2倍图 * 2
    const sourceMap = {
      glass: {
        pos: [268, 253 + 2], // 椭圆的位置,
        sourceRect: [348 + 178, 83 - 80, ...doubtSize], // 裁剪的位置
      },
      rbt: {
        pos: [1, 137 + 253],
        sourceRect: [1, 137 + h - 50, ...doubtSize], // 裁剪的位置
      },
      eleph: {
        pos: [364, 440],
        sourceRect: [346 + 375, 187 + 185, ...doubtSize], // 裁剪的位置
      },
      car: {
        pos: [28, 328 + 253],
        sourceRect: [55, 328 + 320, ...doubtSize], // 裁剪的位置
      },
      kite: {
        pos: [648, 312 + 253],
        sourceRect: [648 + 650, 312 + 310, ...doubtSize], // 裁剪的位置
      },
    };

    const unChioces = Object.keys(sourceMap).filter(k => !reply.includes(k)); // 过滤掉已选中
    const randomIdx = Math.floor(Math.random() * unChioces.length);
    const source = sourceMap[unChioces[randomIdx]];
    // 选中一个提示
    if (!unChioces[randomIdx]) return []
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
          // pointerEvents: 'none',
          borderRadius: [w / 2, h / 2],
          zIndex: 2,
        },
        evt: [
          {
            type: EvtNameEnum.CLICK,
            callback: (evt, elm) => {
              hideMask(elements)
            },
          },
        ],
      };
    });
  }
  function hideMask(elms) {
    findMaskElm(elms).forEach(elm => elm.remove());
  }
  function magClick(elm) {
    // hideMask()
    maskRef.current.forEach(item => {
      item.remove()
    })
    createMaskAndTip();
  }
  /**
   * @description 在页面上生成透明的五个方块用来回答
   */
  function createReply() {
    const replyList = [
      {
        name: 'glass',
        pos: [420, 336],
        size: [82, 53],
      },
      {
        name: 'rbt',
        pos: [243, 464],
        size: [52, 91],
      },
      {
        name: 'eleph',
        pos: [630, 550],
        size: [50, 39],
      },
      {
        name: 'car',
        pos: [141, 655],
        size: [50, 38],
      },
      {
        name: 'kite',
        pos: [855, 635],
        size: [70, 80],
      },
    ].map(item => {
      const {pos} = item
      const x = pos[0] + item.size[0] / 2, y = pos[1] + item.size[1] / 2
      item.pos = [x, y]
      return [
        {
        type: EleTypeEnums.RING,
        option: {
          ...item,
          zIndex: 999,
          innerRadius: 15,
          outerRadius: 30,
          fillColor: '#f40',
          // anchor: [.5, .5]
          opacity: 0,
        },
        // evt: [
        //   {
        //     type: EvtNameEnum.CLICK,
        //     callback: (evt, elm, {stage}) => {
        //       // 添加答案, 如果已经有了，则不再添加
        //       hideMask(stage.layer.children)
        //       if (reply.includes(elm.name)) {
        //         // 已经点过啦
        //         SHOW_TOAST()
        //         return;
        //       }
        //       elm.attr({
        //         opacity: 1
        //       })
        //       reply.push(elm.name);
        //       setReply([...reply]);
        //     },
        //   },
        // ],
      },
      {
        type: EleTypeEnums.BLOCK,
        option: {
          ...item,
          zIndex: 999,
          innerRadius: 15,
          outerRadius: 30,
          bgcolor: '#f40',
          anchor: [.5, .5],
          opacity: 0,
        },
        evt: [
          {
            type: EvtNameEnum.CLICK,
            callback: (evt, elm, {stage}) => {
              // 添加答案, 如果已经有了，则不再添加
              hideMask(stage.layer.children)
              if (reply.includes(elm.name)) {
                // 已经点过啦
                SHOW_TOAST()
                return;
              }
              const elms = findNameByLayer(stage.layer, item.name)
              elms[0].attr({
                opacity: 1
              })
              reply.push(elm.name);
              setReply([...reply]);
            },
          },
        ],
      }
      ];
    });
    return replyList.flat()
  }
  useEffect(() => {
    if (reply.length === 5) {
      submit()
    }
  }, [reply])
  function submit() {
    setVisible(true)
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
      <RewardModal visible={visible} star={getSessionStar()} onClose={onClose} />
    </>
  );
};
export default FindPark;
