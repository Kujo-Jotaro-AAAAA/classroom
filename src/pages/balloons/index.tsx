/**
 * @description 气球
 */
import React, { FC, useState, useEffect, useRef } from 'react';
import { session } from '@/utils/store';
import RewardModal from '@/components/rewardModal';
import * as spritejs from 'spritejs';
import useStage from '@/hooks/useStage';
import useReward from '@/hooks/useReward';
import useComponents from '@/hooks/useComponents';
import useCreateEle, {
  ElesConfig,
  EleTypeEnums,
  EvtNameEnum,
} from '@/hooks/useCreateEle';
// const { Scene, Sprite, Gradient, Rect, Block, Label } = spritejs;
const [blue, red, yellow] = [
  require('@/assets/png0015.png'),
  require('@/assets/png0016.png'),
  require('@/assets/png0017.png'),
];
const colorMap = {
  blue,
  red,
  yellow
}
interface PropTypes {}
const sessionKey = 'optionPos';
const Balloons: FC<PropTypes> = function(props) {
  const balloonElm = useRef<any[]>([])
  const {visible, setVisible, onClose} = useReward()
  const { createOptionsBlock } = useComponents()
  const answer = 'blue'
  const { stage } = useStage({
    elId: 'balloons-container',
  });
  const { elements, setEles, eles } = useCreateEle({
    stage,
  });
  // useEffect(() => {
  //   console.log('stage', stage);

  // }, [stage])
  useEffect(() => {
    initPage()
    return () => {
      return session.clear();
    };
  }, []);
  function initPage() {
    setEles([
      {
        type: EleTypeEnums.LABEL,
        option: {
          text: '虚线框里应该放哪个气球呢? 点点看吧!',
          fontSize: 34,
          // anchor: [0.5, 0.5],
          pos: [61, 93],
        },
      },
      ...createPlaceholderBalloons(),
      // 答题框
      {
        type: EleTypeEnums.BLOCK,
        option: {
          size: [110, 132],
          pos: [884, 210],
          borderRadius: 10,
          border: [1, '#8CABFF'],
          borderDash: 2,
          boxSizing: 'border-box'
        },
        evt: [
          {
            type: EvtNameEnum.TOUCH_MOVE,
            callback: (evt, ele) => {
              console.log('手指进来了');
            },
          },
        ],
      },
      // 选项区
      ...createOptionsBalloons(),
      ...createOptionsBlock(3)
    ]);
  }
  useEffect(() => {
    if (!Array.isArray(elements) || elements.length === 0) return;
    init();
  }, [elements]);
  /**
   * @description 初始化页面
   */
  async function init() {
    getOptionInitPos();
    balloonElm.current = getOptionBalloons()
  }
  /**
   * @description 获取选项的气球
   */
  function getOptionBalloons() {
    return elements.filter(el => {
      return el.name
    });
  }
  /**
   * @description 获取气球的默认位置
   */
  function getOptionInitPos() {
    const balloons = eles.filter(el => {
      return el.option.name
    });
    const defaultPos = balloons.map(b => {
      return b.option.pos;
    });
    session.setKey(sessionKey, defaultPos);
  }
  /**
   * @description 创建默认的气球
   */
  function createPlaceholderBalloons(): ElesConfig[] {
    const initPosX = 61;
    const initPosY = 226;
    return [red, yellow, blue, red, yellow, blue, red, yellow].map(
      (img, idx) => {
        const currPosX = initPosX + 107 * idx;
        return {
          type: EleTypeEnums.SPRITE,
          option: {
            texture: img,
            size: [48.35, 100],
            // anchor: [0.5, 0.5],
            pos: [currPosX, initPosY],
          },
          animates: [
            {
              animate: [{ pos: [currPosX, initPosY + 20] }],
              config: {
                duration: 1200,
                easing: 'ease-in',
                direction: 'alternate',
                iterations: Infinity,
              },
            },
          ],
        };
      },
    );
  }
  /**
   * @description 选项区
   */
  function createOptionsBalloons(): ElesConfig[] {
    const arr = ['red', 'yellow', 'blue'];
    // colorMap
    const balloons = arr.map((imgKey, idx) => {
      const balloonW = 48.35;
      const initPosX = 287 + balloonW / 2;
      const initPosY = 469;
      return {
        type: EleTypeEnums.SPRITE,
        option: {
          name: imgKey,
          texture: colorMap[imgKey],
          size: [balloonW, 100],
          anchor: [0.5, 0.5],
          zIndex: 200,
          pos: [initPosX + (145 + balloonW) * idx, initPosY + 100 / 2],
        },
        evt: [
          {
            type: EvtNameEnum.TOUCH_MOVE,
            callback: (evt, el) => {
              el.attr({
                pos: [evt.x, evt.y],
              });
            },
          },
          {
            type: EvtNameEnum.TOUCH_END,
            callback: (evt, el) => onOptionDragEnd(evt, el, idx),
          },
        ],
      };
    });
    return balloons;
  }
  /**
   * @description 选项拖拽结束
   * @param evt
   * @param el
   * @param idx
   */
  async function onOptionDragEnd(evt, el, idx) {
    const [w, h, x, y] = [110, 132, 884, 210]
    if (x < evt.x && evt.x < x + w && y - h < evt.y && evt.y < y + h) {
      // 贴合到答案框中间
      await el.animate([{ pos: [x + w / 2, y + h / 2] }], {
        duration: 400,
        easing: 'ease-in',
        direction: 'alternate',
        iterations: 1,
        fill: 'forwards',
      });
      if (answer === el.name) {
        setVisible(true)
      } else {
        resetBalloons()
        // initPage()
        // location.reload()
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
    const balloons = balloonElm.current
    const ballPos = session.getKey(sessionKey)
    balloons.forEach(async (ball, idx) => {
      await ball.animate([{
        pos: ballPos[idx]
      }], {
        duration: 400,
        easing: 'ease-in',
        direction: 'alternate',
        iterations: 1,
        fill: 'forwards',
      })
    })
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
      <RewardModal visible={visible} star={3} onClose={onClose} />
    </>
  );
};

export default Balloons;
