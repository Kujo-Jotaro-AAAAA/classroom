/**
 * @description 页面描述
 */
import RewardModal from '@/components/rewardModal';
import useComponents from '@/hooks/useComponents';
import useCreateEle, {
  EleTypeEnums,
  EvtNameEnum
} from '@/hooks/useCreateEle';
import useReward from '@/hooks/useReward';
import useStage from '@/hooks/useStage';
import { session } from '@/utils/store';
import {success_color, success_border, success_color_rgb} from '@/utils/theme';
import { throttle } from 'lodash';
import React, { FC, useEffect, useRef } from 'react';
import { createMarks, getPos } from './utils';
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
    moveH = 80, activeBgColor = 'FFEEE4', activeBorderColor = 'F69472'; // 移动老虎的大小
  const pointerElesRef = useRef<any[]>([]);
  const { stage } = useStage({
    elId: canvasId,
  });
  const { elements, setEles, findNamesByLayer } = useCreateEle({
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
          smooth: true,
          zIndex: 20,
        },
      },
      {
        // 拖动，巧虎
        type: EleTypeEnums.SPRITE,
        option: {
          name: 'move',
          anchor: [0.5, 0.5],
          pos: [84 + moveW / 2, 289 + moveH / 2],
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
  const throttleTouchMove = throttle(touchMove, 40);
  /**
   * @description 处理移动
   * @param evt
   * @param param1
   */
  function touchMove({x, y}, { move, line, pointerEles }) {
    if (isCompleted()) return
    const prev: [number, number] = [
      linePoints.current[linePoints.current.length - 2],
      linePoints.current[linePoints.current.length - 1],
    ];
    // const dir = getCoordinate(prev, [evt.x, evt.y]);
    // console.log('getPos', getPos(prev, [evt.x, evt.y]));

    // const pos: [number, number] = [1, 4].includes(dir) ? [evt.x, prev[1]] : [prev[0], evt.y]
    const {pos, coordinate} = getPos(prev, [x, y]);
    // console.log('prev',JSON.stringify(prev),'pos',  JSON.stringify(pos));
    handleAddPointer(pos, pointerEles);
    move.attr('pos', fixMoveAnchor(pos));
    handleLineEvent(line, pos);
  }
  /**
   * @description 为了使用hook, 在外面监听事件
   */
  function bindMoveListener() {
    const list = findNamesByLayer(stage.layer, ['move', 'line']);
    pointerElesRef.current = findNamesByLayer(stage.layer, ['pointer']);
    if (list.length === 0) return;
    const [move, line] = list;
    if (!move) return;
    // setLinePoints
    move.addEventListener(EvtNameEnum.TOUCH_MOVE, evt =>
      throttleTouchMove(evt, {
        move,
        line,
        pointerEles: pointerElesRef.current,
      }),
    );
  }
  /**
   * @description 处理节点匹配成功添加节点事件
   * @param param0
   * @param pointerEles
   */
  function handleAddPointer([x, y], pointerEles) {
    const {pattern, patternIndex} = patternPointer([x, y], pointerEles);
    if (pattern) {
      // 已滑动到点位
      // 增加点位
      linePoints.current = linePoints.current.concat(pattern);
      activeBg(patternIndex)
    }
  }
  /**
   * @description 高亮已连接的点
   * @param idx
   */
  function activeBg(idx: number) {
      console.log('bgcolor', pointerElesRef.current[idx].attr().bgcolor);
    // if (pointerElesRef.current[idx].attr().bgcolor === success_color_rgb) {
    //   pointerElesRef.current[idx].removeAttribute('bgcolor')
    //   pointerElesRef.current[idx].removeAttribute('borderColor')
    //   return
    // }
    pointerElesRef.current[idx].attr({
      bgcolor: success_color,
      borderColor: success_border
    })
  }
  /**
   * @description 处理线的移动
   * @param lineElm
   * @param points
   */
  function handleLineEvent(lineElm, points: number[]) {
    points[0] = points[0] - moveW;
    lineElm.attr('points', fixLineAnchor([...linePoints.current, ...points]));
  }
  /**
   * @description 是否跟当前默认的节点位置匹配
   * 用点位的ele来判断是否进入，返回精确的默认点位
   * @param pointer
   */
  function patternPointer([x, y], pointerEles) {
    let patternIndex = undefined
    const pattern =  defaultMarks.find((pointer, i) => {
      if (pointerEles[i].isPointCollision(x, y)) {
        patternIndex = i
        return pointer
      }
    });
    return {
      pattern,
      patternIndex
    }
  }
  /**
   * @description 修正move的锚点
   * @param pos
   */
  function fixMoveAnchor(pos: number[]) {
    const [x, y] = pos;
    return [x + moveW / 2, y + moveH / 2];
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
   * @description 是否已走完最后一个
   * @param pos
   */
  function isCompleted() {
    let len = linePoints.current.length
    if (len <=10 ) return false // 少于5个点，不校验
    const lastPointer = linePoints.current.slice(len - 2)
    return defaultMarks[defaultMarks.length - 1].every((m, i) => lastPointer[i] === m)
  }
  /**
   * @description 初始化点位
   */
  function createPointers() {
    return defaultMarks.map(([posx, posy], idx) => {
      const currX = posx + w / 2,
        currY = posy + h / 2;
      return {
        type: EleTypeEnums.BLOCK,
        option: {
          name: 'pointer',
          anchor: [0.5, 0.5],
          size: [w, h],
          border: [2, idx === 0 && success_border],
          borderRadius: w / 2,
          bgcolor: idx === 0 && success_color,
          pos: [currX, currY],
          zIndex: 21
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
