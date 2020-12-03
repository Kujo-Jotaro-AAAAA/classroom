/**
 * @description 页面描述
 */
import RewardModal from '@/components/rewardModal';
import useComponents from '@/hooks/useComponents';
import useCreateEle, { EleTypeEnums, EvtNameEnum } from '@/hooks/useCreateEle';
import useReward from '@/hooks/useReward';
import useStage from '@/hooks/useStage';
import { session } from '@/utils/store';
import {
  success_color,
  success_border,
  success_color_rgb,
} from '@/utils/theme';
import { throttle } from 'lodash';
import React, { FC, useEffect, useRef } from 'react';
import { defaultMarks, getPos, findLinePointsIndex, coordinateMap } from './utils';
const [bg, qiao, back] = [
  require('./assets/bg.png'),
  require('./assets/qiao@2x.png'),
  require('./assets/back@2x.png'),
];
const canvasId = 'delivery-container';
interface PropTypes {}
const sessionKey = 'optionPos';
const Delivery: FC<PropTypes> = function(props) {
  const { visible, setVisible, onClose } = useReward();
  const w = 93,
    h = 93, // 白色圆点的大小
    moveW = 60,
    moveH = 80
  const pointerElesRef = useRef<any[]>([]); // 圆点elm
  const moveElmsRef = useRef<any[]>([]);
  const { stage } = useStage({
    elId: canvasId,
  });
  const { elements, setEles, findNamesByLayer } = useCreateEle({
    stage,
  });
  const { createHorn, createQuestionLabel } = useComponents();
  const linePoints = useRef<number[][]>([defaultMarks[0]]), // 线的锚点
    disabledPointer = [1, 6, 8, 10, 11, 15, 17], // 禁用的点位
    disabledRef = useRef([])
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

  const throttleTouchMove = throttle(touchMove, 40);
  /**
   * @description 处理移动
   * @param evt
   * @param param1
   */
  function touchMove({ x, y }, { move, line, pointerEles }) {
    if (isCompleted()) return;
    const prev = linePoints.current[linePoints.current.length - 1] as [
      number,
      number,
    ];
    const { pos, isX, coordinate } = getPos(prev, [x, y]);
    console.log('touchMove =>', JSON.stringify({
      prev,
      pos,
      curr:  linePoints.current
    }));

    if (handleDir(coordinate, prev, pointerEles) === false) return;

    const movePos = [
        isX ? pos[0] - 40 : pos[0] + 20,
        isX ? pos[1] : pos[1] - 40,
      ],
      linePos = [isX ? pos[0] - 40 : pos[0], isX ? pos[1] : pos[1] - 40];
    if (isDisabledPos(movePos[0], movePos[1])) {
      // 障碍物, 去除事件监听(在touchENd时加回来)
      move.removeEventListener(EvtNameEnum.TOUCH_MOVE, moveEventListener);
      return;
    }
    splicePointer(prev, movePos);
    handleAddPointer(pos, pointerEles);
    handleLineEvent(line, linePos);
    move.attr('pos', fixMoveAnchor(movePos));
  }
  /**
   * @description 判断可使用的方向
   * 通过当前原点位置和象限表的比对，限制拖动的象限
   */
  function handleDir(coordinate, originPos, pointerEles) {
    let index;
    if (linePoints.current.length === 1) {
      // 初始点位
      index = 0;
    }
    const pointIndex = defaultMarks.findIndex(marks => {
      return marks.every((p, i) => p === originPos[i]);
    });
    if (pointIndex !== -1) {
      index = pointIndex;
    }
    if (!index || !coordinateMap[index]) return;
    return coordinateMap[index].includes(coordinate);
  }
  /**
   * @description 路障禁止通行
   * @param x
   * @param y
   */
  function isDisabledPos(x, y) {
    let flag = false;
    disabledRef.current.forEach(dElm => {
      if (dElm.isPointCollision(x + 20, y + 20)) {
        flag = true;
      }
    });
    return flag;
  }
  /**
   * @description 如果当前移动的点比最后一个点小, 说明用户往回拖拽了，要去掉该点
   */
  function splicePointer(prevPos, pos) {
    console.log(
      JSON.stringify({
        prevPos,
        pos,
      }),
    );
    if (linePoints.current.length === 1) return;
    if (pos.some((p, i) => p < prevPos[i])) {
      linePoints.current.pop();
      pointerElesRef.current.forEach(elm => {
        elm.removeAttribute('bgcolor');
        elm.attr({
          border: [0, '#fff'],
        });
      });
      activeBg()
    }
  }
  /**
   * @description 为了使用hook, 在外面监听事件
   */
  function bindMoveListener() {
    moveElmsRef.current = findNamesByLayer(stage.layer, ['move', 'line']);
    pointerElesRef.current = findNamesByLayer(stage.layer, ['pointer']);
    bindDisabledElms();
    if (moveElmsRef.current.length === 0) return;
    const [move] = moveElmsRef.current;
    if (!move) return;
    move.addEventListener(EvtNameEnum.TOUCH_MOVE, moveEventListener);
    move.addEventListener(EvtNameEnum.TOUCH_END, evt => {
      move.addEventListener(EvtNameEnum.TOUCH_MOVE, moveEventListener);
    });
  }
  function moveEventListener(evt) {
    const [move, line] = moveElmsRef.current;
    throttleTouchMove(evt, {
      move,
      line,
      pointerEles: pointerElesRef.current,
    });
  }
  /**
   * @description 绑定禁止走的点位
   */
  function bindDisabledElms() {
    disabledRef.current = disabledPointer.map(idx => {
      return pointerElesRef.current[idx];
    });
  }
  /**
   * @description 处理节点匹配成功添加节点事件
   * @param param0
   * @param pointerEles
   */
  function handleAddPointer([x, y]: number[], pointerEles) {
    const { pattern, patternIndex } = patternPointer([x, y], pointerEles);
    if (pattern && !isRepeat(pattern)) {
      // 已滑动到点位
      // 增加点位
      linePoints.current = linePoints.current.concat([pattern]);
      activeBg();
    }
  }
  /**
   * @description 是否重复了
   * @param pos
   */
  function isRepeat(pos: number[]) {
    return linePoints.current.find(ps => {
      return ps.every((p, i) => p === pos[i]);
    });
  }
  /**
   * @description 高亮已连接的点
   * @param idx
   */
  function activeBg() {
    const indexs = findLinePointsIndex(linePoints.current);
    indexs.forEach(idx => {
      pointerElesRef.current[idx].attr({
        bgcolor: success_color,
        border: [2, success_border]
        // borderColor: success_border,
      });
    });
  }
  /**
   * @description 处理线的移动
   * @param lineElm
   * @param points
   */
  function handleLineEvent(lineElm, points: number[]) {
    // points[0] = points[0] - moveW;
    lineElm.attr(
      'points',
      fixLineAnchor([...linePoints.current.flat(), ...points]),
    );
  }
  /**
   * @description 是否跟当前默认的节点位置匹配
   * 用点位的ele来判断是否进入，返回精确的默认点位
   * @param pointer
   */
  function patternPointer([x, y], pointerEles) {
    let patternIndex = undefined;
    const pattern = defaultMarks.find((pointer, i) => {
      if (pointerEles[i].isPointCollision(x, y)) {
        patternIndex = i;
        return pointer;
      }
    });
    return {
      pattern,
      patternIndex,
    };
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
    let len = linePoints.current.length;
    if (len <= 5) return false; // 少于5个点，不校验
    const lastPointer = linePoints.current.slice(len - 1);
    return defaultMarks[defaultMarks.length - 1]
      .flat()
      .every((m, i) => lastPointer.flat()[i] === m);
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
          zIndex: 21,
        },
      };
    });
  }
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

          // points: fixLineAnchor([...defaultMarks[0], ...defaultMarks[4], ...defaultMarks[5], ...defaultMarks[6]]),
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
          // pos: [84 + moveW / 2, 289 + moveH / 2],
          pos: fixMoveAnchor([84, 289]),
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
      {
        type: EleTypeEnums.SPRITE,
        option: {
          texture: back,
          size: [53, 53],
          pos: [911, 167],
        },
        evt: [
          {
            type: EvtNameEnum.CLICK,
            callback: () => {
              reset();
            },
          },
        ],
      },
      ...createPointers(),
    ]);
  }
  /**
   * @description 重置页面
   */
  function reset() {
    location.reload();
    // linePoints.current = defaultMarks[0]
    // const [move, line] = moveElmsRef.current
    // move.attr({
    //   pos: fixMoveAnchor([84, 289]),
    //   size: [moveW, moveH],
    // })
    // line.attr({
    //   points: fixLineAnchor(defaultMarks[0]),
    // })
    // pointerElesRef.current.forEach((elm, idx) => {
    //   if (idx !== 0) {
    //     elm.removeAttribute('bgcolor')
    //     // elm.removeAttribute('borderColor')
    //     elm.attr({
    //       border: [0, '#fff']
    //     })
    //   }
    // })
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
