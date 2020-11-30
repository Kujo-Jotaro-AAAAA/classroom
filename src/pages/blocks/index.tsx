/**
 * @description 零件
 */
import React, { FC, useState, useEffect, useRef, useMemo } from 'react';
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
const sessionKey = 'replyKeys';

const Blocks: FC<PropTypes> = function(props) {
  const {
    visible,
    setVisible,
    onClose,
    resetReply,
    addSessionReply,
    getSessionStar,
  } = useReward();
  const answer = ['yellow', 'red', 'blue']; // 答案
  const [layUp, setLayUp] = useState<string[]>([]);
  const colorBolcksRef = useRef([]);
  const initColorPos = useRef({});
  const answerBolcksRef = useRef([]);
  const redBolcksRef = useRef([]);
  const initAnswerPos = useRef({});
  const { stage } = useStage({
    elId: canvasId,
  });
  const {
    elements,
    setEles,
    eles,
    findElesByNames,
    resetElmsAttr,
  } = useCreateEle({
    stage,
  });
  const { createHorn, createOptionsBlock } = useComponents();
  useEffect(() => {
    session.clear();
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
      // 回答区
      ...createAnswerBlocks(),
      // 红色盒子
      ...createMaskColorBlocks(),
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
   * @description
   * * 设置了虚线后无法再将其清除, 框架会报错
   *
   */
  function createMaskColorBlocks() {
    const originBlock = createAnswerBlocks();
    return originBlock.map((block, i) => {
      Reflect.deleteProperty(block.option, 'borderDash');
      block.option = {
        ...block.option,
        name: `redBox${i}`,
        // @ts-ignore
        opacity: 0,
        border: [2, '#F57F57'],
      };
      return block;
    });
  }
  /**
   * @description 回答区域
   */
  function createAnswerBlocks() {
    return new Array(3).fill(0).map((_, index) => {
      const w = 96,
        h = 58,
        x = 674 + w / 2 + (w + 7) * index;
      return {
        type: EleTypeEnums.BLOCK,
        option: {
          name: `answer-${index}`,
          anchor: [0.5, 0.5],
          size: [w, h],
          pos: [x, 270 + h / 2],
          border: [2, main_color],
          borderDash: [2],
          borderRadius: 10,
          boxSizing: 'border-box',
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
        x = 280 + w / 2 + (w + 114) * index - 6.5;
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
    redBolcksRef.current = findElesByNames(elements, [
      'redBox0',
      'redBox1',
      'redBox2',
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
      if (!elm) return;
      colorPos[elm?.name] = elm.attr().pos;
    });
    answerBolcksRef.current.forEach(elm => {
      if (!elm) return;

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
    const newReply = session.getKey(sessionKey) || [];
    if (newReply?.includes(ele.name)) return;
    ele.attr({
      pos: [evt.x, evt.y],
      zIndex: 99999,
    });
  }
  /**
   * @description 处理拖拽结束逻辑
   * @param evt
   * @param ele
   */
  function handleColorEleEnd(evt, ele) {
    const newReply = session.getKey(sessionKey) || [];
    if (newReply?.includes(ele.name)) return;
    replaceColorBlock(ele);
  }
  useEffect(() => {
    if (layUp.filter(v => Boolean(v)).length === 3) {
      submit();
    }
  }, [layUp]);
  /**
   * @description 提交答案
   */
  function submit() {
    const correct = answer.every((an, idx) => an === layUp[idx]);
    if (correct) {
      setVisible(true);
      // 将选择区的框颜色变为红色
      redBolcksRef.current.forEach(el => {
        el.attr({
          zIndex: 10,
          opacity: 1,
        });
      });
      const commonBlock = findElesByNames(elements, ['commonBlock-0', 'commonBlock-1', 'commonBlock-2'])
      commonBlock.forEach(block => {
        block.remove()
      })
      return;
    }
    // stage.layer.deactivateAnimations()
    addSessionReply();
    // 提交错误

    moveColorBlockToInitPos();
    setLayUp([]);
  }
  /**
   * @description 进入到答题区域时，将同位置的色块做动画回到初始位置
   * @param ele
   */
  function replaceColorBlock(ele) {
    const aPos = answerBolcksRef.current.map(elm => elm.attr().pos);
    const elseColor = colorBolcksRef.current.filter(v => v.name !== ele.name);
    const isAnsCoverPos = aPos.find(([apx, apy]) =>
      ele.isPointCollision(apx, apy),
    );
    const isAnsCoverPosIdx = aPos.findIndex(([apx, apy]) =>
      ele.isPointCollision(apx, apy),
    );
    if (isAnsCoverPos) {
      ele.animate([{ pos: isAnsCoverPos }], {
        duration: 200,
        easing: 'ease-in',
        direction: 'alternate',
        iterations: 1,
        fill: 'forwards',
      });
      const isCoverColor = elseColor.find(celm => {
        const [cx, cy] = celm.attr().pos;
        return ele.isPointCollision(cx, cy);
      });
      if (isCoverColor) {
        // 跟其他盒子覆盖了
        const pos = initColorPos.current[isCoverColor.name];
        isCoverColor.animate([{ pos }], {
          duration: 200,
          easing: 'ease-in',
          direction: 'alternate',
          iterations: 1,
          fill: 'forwards',
        });
      }
      const newReply = session.getKey(sessionKey) || [null, null, null];
      newReply.splice(isAnsCoverPosIdx, 1, ele.name);
      session.setKey(sessionKey, newReply);
      setLayUp(newReply);
    } else {
      const initPos = initColorPos.current[ele.name];
      ele.animate([{ pos: initPos }], {
        // 滚动回初始节点
        duration: 400,
        easing: 'ease-in',
        direction: 'alternate',
        iterations: 1,
        fill: 'forwards',
      });
    }
     setTimeout(() => {
      ele.removeAttribute('zIndex');
    }, 200);
  }
  /**
   * @description 将颜色块放回原位
   */
  function moveColorBlockToInitPos() {
    setTimeout(() => {
      session.removeKey(sessionKey);
      resetReply();
      colorBolcksRef.current.forEach(async elm => {
        const pos = initColorPos.current[elm.name];
        await elm.animate([{ pos }], {
          duration: 200,
          easing: 'ease-in',
          direction: 'alternate',
          iterations: 1,
          fill: 'forwards',
        });
      });
    }, 500)
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
        star={getSessionStar()}
        onClose={() => {
          onClose();
          moveColorBlockToInitPos();
        }}
      />
    </>
  );
};
export default Blocks;
