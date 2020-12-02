/**
 * @description 页面描述
 */
import React, { FC, useState, useEffect, useRef, useMemo } from 'react';
import { session } from '@/utils/store';
import RewardModal from '@/components/rewardModal';
import useStage from '@/hooks/useStage';
import useReward from '@/hooks/useReward';
import useComponents from '@/hooks/useComponents';
import {debounce, throttle} from 'lodash';
import { createMarks, getDirection } from './utils';
import useCreateEle, {
  ElesConfig,
  EleTypeEnums,
  EvtNameEnum,
} from '@/hooks/useCreateEle';
const [bg, qiao] = [
  require('./assets/bg.png'),
  require('./assets/qiao@2x.png'),
];
const canvasId = 'delivery-container';
interface PropTypes {}
const sessionKey = 'optionPos';
const Delivery: FC<PropTypes> = function(props) {
  const { visible, setVisible, onClose } = useReward();
  const w = 93,
    h = 93, // 白色圆点的大小
    moveW = 60,
    moveH = 80; // 移动老虎的大小
  const lineRef = useRef<any>(null);
  const { stage } = useStage({
    elId: canvasId,
  });
  const {
    elesMerge,
    elements,
    setEles,
    findEleByName,
    findElesByNames,
    findNamesByLayer,
  } = useCreateEle({
    stage,
  });
  const { createHorn, createQuestionLabel } = useComponents();
  const defaultMarks = createMarks(),
  linePoints = useRef<number[]>(defaultMarks[0]); // 线的锚点
  useEffect(() => {
    initPage();
    return () => {
      return session.clear();
    };
  }, []);
  useEffect(() => {
    if (!stage?.layer) return;
    bindMoveListener();
  }, [stage?.layer, elements]);

  function initPage() {
    setEles([
      createHorn(),
      createQuestionLabel('巧虎想去看大熊猫，请你试试看哪条路线才是正确的呢?'),
      {
        // 线
        type: EleTypeEnums.POLYLINE,
        option: {
          name: 'line',
          pos: [0, 0],
          // pos: defaultMarks[0],
          points: fixLineAnchor(defaultMarks[0]),
          strokeColor: '#F79674',
          lineWidth: 26,
          zIndex: 20,
        },
      },
      {
        // 拖动，巧虎
        type: EleTypeEnums.SPRITE,
        option: {
          name: 'move',
          anchor: [0.5, 0.5],
          pos: fixMoveAnchor(defaultMarks[0]),
          size: [moveW, moveH],
          texture: qiao,
          zIndex: 99,
        },
      },
      {
        type: EleTypeEnums.SPRITE,
        option: {
          texture: bg,
          size: [1024, 535.25],
          pos: [0, 233],
        },
      },
      ...createPointers(),
    ]);
  }
  const throttleTouchMove = throttle(touchMove, 40)
  /**
   * @description 处理移动
   * @param evt
   * @param param1
   */
  function touchMove(evt, {move, line, pointerEles}) {
    move.attr({
        pos: [evt.x, evt.y],
      });
      const matchPointer = patternPointer([evt.x, evt.y], pointerEles);
      if (matchPointer) { // 已滑动到点位
        // 增加点位
        linePoints.current = linePoints.current.concat(matchPointer)
      }
      handleLineEvent(line, [evt.x, evt.y])
  }
  /**
   * @description 为了使用hook, 在外面监听事件
   */
  function bindMoveListener() {
    const list = findNamesByLayer(stage.layer, ['move', 'line']);
    const pointerEles = findNamesByLayer(stage.layer, ['pointer']);
    if (list.length === 0) return;
    const [move, line] = list;
    if (!move) return;
    // setLinePoints
    move.addEventListener(EvtNameEnum.TOUCH_MOVE,(evt) => throttleTouchMove(evt, {
      move,
      line,
      pointerEles
    }));
  }

  /**
   * @description 处理线的移动
   * @param lineElm
   * @param points
   */
  function handleLineEvent(lineElm, points: number[]) {
    lineElm.attr('points', fixLineAnchor([...linePoints.current, ...points]))
  }
  /**
   * @description 跟当前默认的节点位置匹配
   * @param pointer
   */
  function patternPointer([x, y], pointerEles) {
    return defaultMarks.find((pointer, i) => {
      return pointerEles[i].isPointCollision(x, y) && pointer
    });
  }
  /**
   * @description 修正move的锚点
   * @param pos
   */
  function fixMoveAnchor(pos: number[]) {
    const [x, y] = pos;
    return [x + moveW * 0.7, y + moveH / 2];
  }
  /**
   * @description 修正线的锚点
   * @param pointers
   */
  function fixLineAnchor(pointers: number[]) {
    return pointers.map((p, i) => {
      const isX = (i + 1) % 2 === 1;
      return isX ? p + w / 2 : p + h / 2;
    });
  }
  /**
   * @description 初始化点位
   */
  function createPointers() {
    return defaultMarks.map(([posx, posy]) => {
      const currX = posx + w / 2,
        currY = posy + h / 2;
      return {
        type: EleTypeEnums.BLOCK,
        option: {
          name: 'pointer',
          anchor: [0.5, 0.5],
          size: [w, h],
          border: [2, '#f40'],
          borderRadius: w / 2,
          pos: [currX, currY],
        },
      };
    });
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
export default Delivery;
