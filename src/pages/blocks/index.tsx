/**
 * @description 零件
 */
import React, { FC, useState, useEffect, useRef } from 'react';
import { session } from '@/utils/store';
import RewardModal from '@/components/rewardModal';
import useStage from '@/hooks/useStage';
import useReward from '@/hooks/useReward';
import useComponents from '@/hooks/useComponents';
import { main_color } from '@/utils/theme';
import useCreateEle, {
  ElesConfig,
  EleTypeEnums,
  EvtNameEnum,
} from '@/hooks/useCreateEle';
const assertMap = {
  red: require('@/assets/png0026.png'),
  yellow: require('@/assets/png0027.png'),
  blue: require('@/assets/png0028.png'),
};
const canvasId = 'blocks-container';
interface PropTypes {}
const sessionKey = 'optionPos';
const Blocks: FC<PropTypes> = function(props) {
  const { visible, setVisible, onClose } = useReward();
  const answer = ['yellow', 'red', 'blue']; // 答案
  const [reply, setReply] = useState<string[]>([])
  const colorBolcksRef = useRef([]);
  const initColorPos = useRef({});
  const answerBolcksRef = useRef([]);
  const initAnswerPos = useRef({});

  const { stage } = useStage({
    elId: canvasId,
  });
  const { elements, setEles, eles, findElesByNames, resetElmsAttr } = useCreateEle({
    stage,
  });
  const { createHorn, createOptionsBlock } = useComponents();
  useEffect(() => {
    initPage();
    return () => {
      return session.clear();
    };
  }, []);
  function initPage() {
    setEles([
      createHorn(),
      {
        type: EleTypeEnums.LABEL,
        option: {
          text: '仔细观察下面的规律，问号处依次是什么呢?',
          fontSize: 34,
          pos: [61, 93],
        },
      },
      ...createQuestionBlocks(),
      // 问题区
      ...createAnswerBlocks(),
      // 占位
      ...createOptionsBlock(3, 'none'),
      // 答题色块
      ...createOptionsColorBlock(),
    ]);
  }
  /**
   * @description 题目
   */
  function createQuestionBlocks() {
    return ['yellow', 'red', 'blue', 'yellow', 'red', 'blue'].map(
      (color, index) => {
        const w = 79,
          x = 69 + (w + 23) * index;
        return {
          type: EleTypeEnums.SPRITE,
          option: {
            texture: assertMap[color],
            size: [w, 37],
            pos: [x, 281],
          },
        };
      },
    );
  }
  /**
   * @description 答案区域
   */
  function createAnswerBlocks() {
    return new Array(3).fill(0).map((_, index) => {
      const w = 96,
        h = 58,
        x = 674 + w / 2 + (w + 23) * index;
      return {
        type: EleTypeEnums.BLOCK,
        option: {
          name: `answer-${index}`,
          anchor: [0.5, 0.5],
          size: [w, h],
          pos: [x, 270 + h / 2],
          border: [2, main_color],
          borderDash: 2,
          borderRadius: 10,
        },
      };
    });
  }
  /**
   * @description 创建需要拖拽的色块
   */
  function createOptionsColorBlock() {
    return ['red', 'yellow', 'blue'].map((color, index) => {
      const w = 79,
        h = 37,
        x = 280 + w / 2 + (w + 114) * index;
      return {
        type: EleTypeEnums.SPRITE,
        option: {
          anchor: [0.5, 0.5],
          name: `${color}`,
          size: [w, h],
          pos: [x, 500 + h / 2],
          texture: assertMap[color],
        },
        evt: [
          {
            type: EvtNameEnum.TOUCH_MOVE,
            callback: handleColorEleMove,
          },
          {
            type: EvtNameEnum.TOUCH_END,
            callback: handleColorEleEnd,
          },
        ],
      };
    });
  }
  useEffect(() => {
    if (!Array.isArray(elements) || elements.length === 0) return;
    bindRef();
  }, [elements]);
  function bindRef() {
    colorBolcksRef.current = findElesByNames(elements, [
      'red',
      'yellow',
      'blue',
    ]);
    answerBolcksRef.current = findElesByNames(elements, [
      'answer-0',
      'answer-1',
      'answer-2',
    ]);
    setColorBlockInitPos();
  }
  /**
   * @description 初始化各个节点的位置
   */
  function setColorBlockInitPos() {
    const colorPos = {};
    const answerPos = {};
    colorBolcksRef.current.forEach(elm => {
      colorPos[elm.name] = elm.attr().pos;
    });
    answerBolcksRef.current.forEach(elm => {
      answerPos[elm.name] = elm.attr().pos;
    });
    initColorPos.current = colorPos;
    initAnswerPos.current = answerPos;
  }
  /**
   * @description 处理拖拽逻辑
   * @param evt
   * @param ele
   */
  function handleColorEleMove(evt, ele) {
    // const curr = ele.name
    ele.attr({
      pos: [evt.x, evt.y],
    });
  }
  /**
   * @description 处理拖拽结束逻辑
   * @param evt
   * @param ele
   */
  function handleColorEleEnd(evt, ele) {
    // 进入到答题区域时，将另外两个色块做动画回到
    replaceColorBlock(ele);
    pullRightBlock(ele);
  }
  /**
   * @description 进入到答题区域时，将同位置的色块做动画回到初始位置
   * @param ele
   */
  function replaceColorBlock(ele) {
    colorBolcksRef.current.forEach(async elm => {
      const [x, y] = ele.attr().pos;
      const isCover = elm.isPointCollision(x, y); // 跟当前色块覆盖了
      if (elm.name !== ele.name && isCover) {
        const pos = initColorPos.current[elm.name];
        await elm.animate([{ pos }], {
          duration: 400,
          easing: 'ease-in',
          direction: 'alternate',
          iterations: 1,
          fill: 'forwards',
        });
      }
    });
  }
  useEffect(() => {
    console.log('reply ==>', reply);
    if (reply.length === 3) {
      submit()
    }
  }, [reply])
  /**
   * @description 提交答案
   */
  function submit() {
    const correct = answer.every((an, idx) => an === reply[idx])
    if(correct) {
      setVisible(true)
      return
    }
    // 提交错误
    moveColorBlockToInitPos()
    setReply([])
  }
  /**
   * @description 放置到答题框并纠正方块的位置
   */
  function pullRightBlock(ele) {
    let flag = false; // 为true时，说明已经有一项匹配了
    answerBolcksRef.current.forEach(async answerBlock => {
      const [x, y] = ele.attr().pos;
      const isCover = answerBlock.isPointCollision(x, y); // 已放进回答框
      if (isCover) {
        flag = true
        const pos = initAnswerPos.current[answerBlock.name];
        await ele.animate([{ pos }], {
          duration: 400,
          easing: 'ease-in',
          direction: 'alternate',
          iterations: 1,
          fill: 'forwards',
        });
        setReply(reply => {
          reply.push(ele.name)
          return [...reply]
        })
        return
      }
      if (flag) return
      const initPos = initColorPos.current[ele.name];
      await ele.animate([{ pos: initPos }], {
        duration: 400,
        easing: 'ease-in',
        direction: 'alternate',
        iterations: 1,
        fill: 'forwards',
      });
    });
  }
  function moveColorBlockToInitPos() {
    colorBolcksRef.current.forEach(async elm => {
      const pos = initColorPos.current[elm.name]
      console.log(pos, elm.name, initColorPos);
      await elm.animate([
        {pos}
      ],{
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
export default Blocks;
