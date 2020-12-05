/**
 * @description 气球
 */
import React, { FC, useState, useEffect, useRef } from 'react';
import { session } from '@/utils/store';
import RewardModal from '@/components/rewardModal';
import { history } from 'umi';
import useStage from '@/hooks/useStage';
import useReward from '@/hooks/useReward';

import useComponents from '@/hooks/useComponents';
import useCreateEle, {
  ElesConfig,
  EleTypeEnums,
  EvtNameEnum,
} from '@/hooks/useCreateEle';
import { fail_color, success_border, success_color } from '@/utils/theme';
const balloonTmp = history.location.query.tmp;
const currIndex = balloonTmp || 0
const colorMap = {
  ba: require('@/assets/balls/png0038@2x.png'),
  sc: require('@/assets/balls/png0039@2x.png'),
  fb: require('@/assets/balls/png0040@2x.png'),
};
interface PropTypes {}
const sessionKey = 'optionPos';
const Balloons: FC<PropTypes> = function(props) {
  const balloonElm = useRef<any[]>([]);
  const balloonBlockElm = useRef<any[]>([]);
  const { visible, setVisible, onClose, setSessionReply, clearSessionReply, getSessionReply, getStarFn } = useReward();
  const { createOptionsBlock, createStep, createHorn } = useComponents();
  const replyRef = useRef(null);
  const w = 81, h = 82 // 静态资源尺寸
  const answer = 'sc';
  const { stage } = useStage({
    elId: 'balloons-container',
  });
  const { elements, setEles, eles, findEleByName, findElesByNames } = useCreateEle({
    stage,
  });
  const tmpMap = [
    {
      replyBlock: {
        pos: [868, 239],
      },
      balloons: [
        'ba',
        'sc',
        'sc',
        'ba',
        'sc',
        'sc',
        'ba',
        'sc',
        '',
      ],
      answer: 'sc'
    }
  ];
  useEffect(() => {
    initPage();
    return () => {
      return session.clear();
    };
  }, []);
  function initPage() {
    setEles([
      ...createStep(2),
      createHorn('L0003'),
      {
        type: EleTypeEnums.LABEL,
        option: {
          text: '虚线框里应该放哪个球呢? 点点看吧!',
          fontSize: 34,
          // anchor: [0.5, 0.5],
          pos: [61, 93],
        },
      },
      ...createPlaceholderBalloons(),
      // 选项区
      ...createOptionsBalloons(),
      // ...createOptionsBlock(3),
      ...payloadBlockEvt()
    ]);
  }
  useEffect(() => {
    if (!Array.isArray(elements) || elements.length === 0) return;
    init();
  }, [elements]);
  /**
   * @description 盒子
   */
  function payloadBlockEvt() {
    return createOptionsBlock(3).map((block, i) => {
      const colorMap = {
        0: 'ba',
        1: 'sc',
        2: 'fb'
      }, posX = 240 + (35 + 158) * i
      block.option.pos = [posX, 457]
      block.option.pointerEvents = 'visible'
      block.option.name = colorMap[i]
      // block.option.zIndex = colorMap[i]
      return {
        ...block,
        evt: [{
        type: EvtNameEnum.CLICK,
          callback: (evt, el) => {
            blockClick(el)
          }
        }]
      }
    })
  }
  function blockClick(el) {
    console.log(el);

    if (tmpMap[currIndex].answer === el.name) {
      setVisible(true);
      el.attr({
        bgcolor: success_color,
        borderColor: success_border
      })
    } else {
      el.attr({
        bgcolor: fail_color
      })
      setSessionReply(getSessionReply() + 1)
      setTimeout(() => {
        resetBalloons();
      }, 1000)
    }
  }
  /**
   * @description 初始化页面
   */
  async function init() {
    getOptionInitPos();
    // 获取答题框
    replyRef.current = findEleByName(elements, 'reply');

    balloonElm.current = getOptionBalloons();
    balloonBlockElm.current = findElesByNames(elements, ['fb', 'ba', 'sc'])
  }
  /**
   * @description 获取选项的气球
   */
  function getOptionBalloons() {
    return elements.filter(el => {
      return el.name;
    });
  }
  /**
   * @description 获取气球的默认位置
   */
  function getOptionInitPos() {
    const balloons = eles.filter(el => {
      return el.option.name;
    });
    const defaultPos = balloons.map(b => {
      return b.option.pos;
    });
    session.setKey(sessionKey, defaultPos);
  }
  /**
   * @description 创建默认的
   */
  function createPlaceholderBalloons(): ElesConfig[] {
    const initPosX = 73;
    const initPosY = 248;
    return tmpMap[currIndex].balloons.map((color, idx) => {
      const currPosX = initPosX + (w + 19) * idx;
      const isPlaceholder = colorMap[color];
      return isPlaceholder
        ? {
            type: EleTypeEnums.SPRITE,
            option: {
              texture: colorMap[color],
              size: [w, h],
              // anchor: [0.5, 0.5],
              pos: [currPosX, initPosY],
            },
          }
        : {
            type: EleTypeEnums.BLOCK,
            option: {
              name: 'reply',
              size: [100, 100],
              pos: getHalfPos(tmpMap[currIndex].replyBlock.pos, [100, 100]),
              anchor: [.5, .5],
              borderRadius: 10,
              border: [1, '#8CABFF'],
              borderDash: 2,
              boxSizing: 'border-box',
            }
          };
    });
  }
  /**
   * @description 获取锚点居中元素的定位信息
   * @param originPos
   * @param w
   * @param h
   */
  function getHalfPos(oPos: number[], [w, h]) {
    const [ox, oy] = oPos
    return [ox + w / 2, oy + h / 2]
  }
  /**
   * @description 选项区
   */
  function createOptionsBalloons(): ElesConfig[] {
    const arr = [ 'ba', 'sc','fb'];
    // colorMap
    const balloons = arr.map((imgKey, idx) => {
      const initPosX = 279 + w / 2;
      const initPosY = 478;
      const ballW = imgKey === 'fb' ? 100 : w
      const ballH = imgKey === 'fb' ? 59 : h
      return {
        type: EleTypeEnums.SPRITE,
        option: {
          name: `balloon-${imgKey}`,
          texture: colorMap[imgKey],
          size: [ballW, ballH],
          anchor: [0.5, 0.5],
          pointerEvents: 'none',
          zIndex: 1,
          pos: [initPosX + (112 + w) * idx, initPosY + h / 2],
        },
        evt: [
          {
            type: EvtNameEnum.CLICK,
            callback: (evt, el) => {
              const currBlock = balloonBlockElm.current.find(blockElm => {
                const elName = el.name.split('-')
                return blockElm.name === elName[1]
              })
              blockClick(currBlock)
            },
          },
          // {
          //   type: EvtNameEnum.CLICK,
          //   callback: (evt, el) => onOptionClick(el),
          // },
        ],
      };
    });
    return balloons;
  }
  async function onOptionClick(el) {
    // await el.animate([{ pos: replyRef.current.attr().pos }], {
    //   duration: 400,
    //   easing: 'ease-in',
    //   direction: 'alternate',
    //   iterations: 1,
    //   fill: 'forwards',
    // });
    if (tmpMap[currIndex].answer === el.name) {
      setVisible(true);
      el.attr({
        bgcolor: success_color,
        borderColor: success_border
      })
    } else {
      el.attr({
        bgcolor: fail_color
      })
      setSessionReply(getSessionReply() + 1)
      // resetBalloons();
    }
    // setTimeout(() => {
    // }, 1000)
  }
  /**
   * @description 选项拖拽结束
   * @param evt
   * @param el
   * @param idx
   */
  async function onOptionDragEnd(evt, el, idx) {
    el.attr('pos', replyRef.current.attr().pos)
    const isCover = replyRef.current.isPointCollision(evt.x, evt.y);
    if (isCover) {
      const originPos = replyRef.current.attr().pos;
      // 贴合到答案框中间
      await el.animate([{ pos: originPos }], {
        duration: 400,
        easing: 'ease-in',
        direction: 'alternate',
        iterations: 1,
        fill: 'forwards',
      });
      if (tmpMap[currIndex].answer === el.name) {
        setVisible(true);
      } else {
        resetBalloons();
      }
      return;
    }
    // 未拖放到答案框
    const defaultPos = session.getKey(sessionKey);
    await el.animate([{ pos: [evt.x, evt.y] }, { pos: defaultPos[idx] }], {
      duration: 400,
      easing: 'ease-in',
      direction: 'alternate',
      iterations: 1,
      fill: 'forwards',
    });
  }
  /**
   * @description 重置气球的位置
   */
  function resetBalloons() {
    const balloons = balloonBlockElm.current
    // const ballPos = session.getKey(sessionKey);
    balloons.forEach(async (ball, idx) => {
      ball.attr({
        bgcolor: '#fff'
      })
      // await ball.animate(
      //   [
      //     {
      //       pos: ballPos[idx],
      //     },
      //   ],
      //   {
      //     duration: 400,
      //     easing: 'ease-in',
      //     direction: 'alternate',
      //     iterations: 1,
      //     fill: 'forwards',
      //   },
      // );
    });
  }
  return (
    <>
      <div
        id={'balloons-container'}
        style={{
          width: '100vw',
          height: '100vh',
        }}
      />
      <RewardModal visible={visible} star={getStarFn(getSessionReply())} onClose={() => {
        onClose()
        clearSessionReply()
      }} />
    </>
  );
};

export default Balloons;
