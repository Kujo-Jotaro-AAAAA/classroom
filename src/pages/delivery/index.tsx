/**
 * @description 页面描述
 */
import RewardModal from '@/components/rewardModal';
import useComponents from '@/hooks/useComponents';
import useCreateEle, { EleTypeEnums, EvtNameEnum } from '@/hooks/useCreateEle';
import useReward from '@/hooks/useReward';
import useStage from '@/hooks/useStage';
// import {PLAY_AUDIO} from '@/utils/bridge';
import { session } from '@/utils/store';
import { throttle } from 'lodash';
import React, { FC, useEffect } from 'react';
import { createObjectBindingPattern } from 'typescript';
interface PropTypes {}

const [bg, qiao, back] = [
  require('./assets/bg.png'),
  require('./assets/qiao@2x.png'),
  require('./assets/back@2x.png'),
];

const elId = 'delivery-container';
const disableDraggingLines = true;

const configs = {
  circle: {
    coordinate: [
      [
        [112, 330],
        [112, 455],
        [112, 568],
        [112, 692],
      ],
      [
        [313, 330],
        [313, 455],
        [313, 568],
        [313, 692],
      ],
      [
        [510, 330],
        [510, 455],
        [510, 568],
        [510, 692],
      ],
      [
        [709, 330],
        [709, 455],
        [709, 568],
        [709, 692],
      ],
      [
        [910, 330],
        [910, 455],
        [910, 568],
        [910, 692],
      ],
    ],
    radius: 46,
    border: { color: '#F69472', width: 2 },
    color: '#FFEEE4',
  },
  blocks: [
    [0, 1],
    [1, 2],
    [2, 0],
    [2, 2],
    [2, 3],
    [3, 3],
    [4, 1],
  ],
  polyline: {
    coordinate: [
      [
        [112, 323],
        [112, 448],
        [112, 575],
        [112, 691],
      ],
      [
        [312, 323],
        [312, 448],
        [312, 575],
        [312, 691],
      ],
      [
        [511, 323],
        [511, 448],
        [511, 575],
        [511, 691],
      ],
      [
        [712, 323],
        [712, 448],
        [712, 575],
        [712, 691],
      ],
      [
        [910, 323],
        [910, 448],
        [910, 575],
        [910, 691],
      ],
    ],
    width: 26,
    color: '#F79674',
  },
  tiger: {
    width: 60,
    height: 80,
  },
  backward: {
    width: 53,
    height: 53,
    coordinate: [911, 167],
  },
  background: {
    width: 1024,
    height: 535.25,
    coordinate: [0, 233],
  },
};

const Delivery: FC<PropTypes> = function(props) {
  const { visible, onClose, getSessionStar, setVisible } = useReward();
  const { stage } = useStage({ elId });
  const { elements, setEles, findNamesByLayer } = useCreateEle({ stage });
  const { createHorn, createQuestionLabel } = useComponents();

  const state = {
    circles: [],
    polylines: [],
    current: null,
  };

  const cache = {
    blocks: new Map(),
  };

  let isEventBinded = false;

  useEffect(() => {
    initPage();
    return () => {
      return session.clear();
    };
  }, []);

  useEffect(() => {
    if (!stage?.layer) return;
    init([0, 0]);
    bindEvents();
  }, [stage?.layer, elements]);

  function bindEvents() {
    if (isEventBinded) return;
    const [tiger, backward] = findNamesByLayer(stage.layer, [
      'tiger',
      'backward',
    ]);

    if (tiger) {
      tiger.addEventListener(
        EvtNameEnum.TOUCH_MOVE,
        throttle(onTouchMoving, 50),
      );
      tiger.addEventListener(EvtNameEnum.TOUCH_END, onTouchEnded);

      backward.addEventListener(EvtNameEnum.CLICK, () => {
        init([0, 0]);
      });

      configs.circle.coordinate.forEach((rows, x) => {
        rows.forEach((pos, y) => {
          findNamesByLayer(stage.layer, [
            `circle-${x}-${y}`,
          ])[0].addEventListener(EvtNameEnum.TOUCH_START, () => {
            !isBlock([x, y]) && isNeighbour([x, y]) && commit([x, y]);
          });
        });
      });

      isEventBinded = true;
    }
  }

  const QuadrantEnums = {
    CIRCLE_CENTER: 5,
    CIRCLE_TOP: 10,
    CIRCLE_BOTTOM: 12,
    CIRCLE_LEFT: 13,
    CIRCLE_RIGHT: 11,
    MOVING_UP: 2,
    MOVING_DOWN: 8,
    MOVING_LEFT: 4,
    MOVING_RIGHT: 6,
    INVALID_TOP_LEFT: 1,
    INVALID_TOP_RIGHT: 3,
    INVALID_BOTTOM_LEFT: 7,
    INVALID_BOTTOM_RIGHT: 9,
  };

  /**
   * 根据手指位置，计算得到象限代码
   * @param pos
   * @param param1
   *
   * 象限说明：
   *
   * ----------------------------------------------
   * |        |        |   10   |        |        |
   * ----------------------------------------------
   * |        |   01   |   02   |   03   |        |
   * ----------------------------------------------
   * |   13   |   04   |   05   |   06   |   11   |
   * ----------------------------------------------
   * |        |   07   |   08   |   09   |        |
   * ----------------------------------------------
   * |        |        |   12   |        |        |
   * ----------------------------------------------
   *
   * 05: 正中央的圆圈范围
   * 10: 上方相邻的圆圈范围
   * 11: 右侧相邻的圆圈范围
   * 12: 下方相邻的圆圈范围
   * 13: 左侧相信的圆圈范围
   * 04: 正在水平向左移动
   * 06: 正在水平向右移动
   * 02: 正在垂直向上移动
   * 08: 正在垂直向下移动
   *
   */
  function getQuadrant(pos) {
    const delta = 25;
    const coordinate = configs.circle.coordinate;
    const [posX, posY] = pos;
    const [currentX, currentY] = state.current;
    const [anchorX, anchorY] = coordinate[currentX][currentY];
    const [left, right, top, bottom] = [
      currentX === 0 ? 0 : coordinate[currentX - 1][currentY][0],
      currentX === 4 ? 0 : coordinate[currentX + 1][currentY][0],
      currentY === 0 ? 0 : coordinate[currentX][currentY - 1][1],
      currentY === 3 ? 0 : coordinate[currentX][currentY + 1][1],
    ];

    if (posX < anchorX - delta) {
      if (posY < anchorY - delta) {
        return QuadrantEnums.INVALID_TOP_LEFT;
      } else if (posY > anchorY + delta) {
        return QuadrantEnums.INVALID_BOTTOM_LEFT;
      } else {
        if (left > 0 && posX < left + delta) {
          return QuadrantEnums.CIRCLE_LEFT;
        } else {
          return QuadrantEnums.MOVING_LEFT;
        }
      }
    } else if (posX > anchorX + delta) {
      if (posY < anchorY - delta) {
        return QuadrantEnums.INVALID_TOP_RIGHT;
      } else if (posY > anchorY + delta) {
        return QuadrantEnums.INVALID_BOTTOM_RIGHT;
      } else {
        if (right > 0 && posX > right - delta) {
          return QuadrantEnums.CIRCLE_RIGHT;
        } else {
          return QuadrantEnums.MOVING_RIGHT;
        }
      }
    } else {
      if (posY < anchorY - delta) {
        if (top > 0 && posY < top + delta) {
          return QuadrantEnums.CIRCLE_TOP;
        } else {
          return QuadrantEnums.MOVING_UP;
        }
      } else if (posY > anchorY + delta) {
        if (bottom > 0 && posY > bottom - delta) {
          return QuadrantEnums.CIRCLE_BOTTOM;
        } else {
          return QuadrantEnums.MOVING_DOWN;
        }
      } else {
        return QuadrantEnums.CIRCLE_CENTER;
      }
    }
  }

  /**
   * 判断坐标是否为路障
   * @param x
   * @param y
   */
  function isBlock([x, y]) {
    return cache.blocks.has(`[${x},${y}]`);
  }

  /**
   * 判断坐标是否为当前节点的邻居
   * @param x
   * @param y
   */
  function isNeighbour([x, y]) {
    const [anchorX, anchorY] = state.current;
    return (
      (anchorX === x && Math.abs(anchorY - y) === 1) ||
      (anchorY === y && Math.abs(anchorX - x) === 1)
    );
  }

  /**
   * 判断坐标是否相同，如果两个参数中，任何一方为空或者格式不正确，则返回 false。
   * @param coordinate
   * @param target
   */
  function coordinateEquals(coordinate, target) {
    if (coordinate && target) {
      if (Array.isArray(coordinate) && Array.isArray(target)) {
        if (coordinate.length === 2 && target.length === 2) {
          return coordinate[0] === target[0] && coordinate[1] === target[1];
        }
      }
    }
    return false;
  }

  /**
   * 处理手指拖动事件
   * @param e
   */
  function onTouchMoving(e) {
    const [tiger, walking] = findNamesByLayer(stage.layer, [
      'tiger',
      'walking',
    ]);
    const [x, y] = state.current;
    const [anchorX, anchorY] = configs.circle.coordinate[x][y];
    const [polyX, polyY] = configs.polyline.coordinate[x][y];
    const quadrant = getQuadrant([e.x, e.y]);

    /**
     * 将小老虎恢复原来的位置
     */
    function restore() {
      tiger.attr({ pos: [anchorX, anchorY] });
      !disableDraggingLines && walking.attr({ points: [] });
    }

    /**
     * 让小老虎随手指拖动，水平移动
     */
    function moveHorizontal() {
      tiger.attr({ pos: [e.x, anchorY] });
      !disableDraggingLines &&
        walking.attr({ points: [polyX, polyY, e.x, polyY] });
    }

    /**
     * 让小老虎随手指拖动，垂直移动
     */
    function moveVertical() {
      tiger.attr({ pos: [anchorX, e.y] });
      !disableDraggingLines &&
        walking.attr({ points: [polyX, polyY, polyX, e.y] });
    }

    /**
     * 尝试将新的位置提交为新的坐标
     * @param x - 新的坐标位置
     * @param y - 新的坐标位置
     * @param moveFunction - 移动函数，水平移动或者竖直移动
     */
    function trial([x, y], moveFunction) {
      if (isBlock([x, y])) {
        restore();
      } else {
        moveFunction();
        commit([x, y]);
      }
    }

    if (tiger) {
      switch (quadrant) {
        case QuadrantEnums.MOVING_UP:
        case QuadrantEnums.MOVING_DOWN:
          moveVertical();
          break;
        case QuadrantEnums.MOVING_LEFT:
        case QuadrantEnums.MOVING_RIGHT:
          moveHorizontal();
          break;
        case QuadrantEnums.CIRCLE_RIGHT:
          trial([x + 1, y], moveHorizontal);
          break;
        case QuadrantEnums.CIRCLE_TOP:
          trial([x, y - 1], moveVertical);
          break;
        case QuadrantEnums.CIRCLE_LEFT:
          trial([x - 1, y], moveHorizontal);
          break;
        case QuadrantEnums.CIRCLE_BOTTOM:
          trial([x, y + 1], moveVertical);
          break;
        default:
          restore();
          break;
      }
    }
  }

  /**
   * 处理手指拖动结束事件
   */
  function onTouchEnded() {
    const [tiger, walking] = findNamesByLayer(stage.layer, [
      'tiger',
      'walking',
    ]);
    const [x, y] = state.current;
    const [anchorX, anchorY] = configs.circle.coordinate[x][y];

    /**
     * 将小老虎恢复原来的位置
     */
    function restore() {
      tiger.attr({ pos: [anchorX, anchorY] });
      !disableDraggingLines && walking.attr({ points: [] });
    }

    restore();
  }

  /**
   * 初始化游戏状态，将 state 恢复初值，清除缓存等。
   * @param x - 起始的坐标
   * @param y - 起始的坐标
   */
  function init([x, y]) {
    // 清除并重建缓存数据
    cache.blocks.clear();
    configs.blocks.map(pos => {
      cache.blocks.set(`[${pos[0]},${pos[1]}]`, pos);
    });

    // 清除并重建 state 的初值
    state.current = [x, y];
    state.circles = [];
    state.polylines = [];

    // 清除并重绘所有页面元素
    update();
  }

  /**
   * 提交新的游戏状态，更新 state 状态，保存或回退历史等。
   * @param x - 新的坐标
   * @param y - 新的坐标
   */
  function commit([x, y]) {
    // 如果新的坐标与原来的相同，则不做任何处理
    if (coordinateEquals([x, y], state.current)) return;

    let remove = null;

    if (state.circles.length === 0) {
      // 处理第一次移动，此时还没有历史状态，直接将最新状态保存
      state.circles.push([...state.current]);
      state.polylines.push([...state.current]);
    } else {
      // 处理第二次及以后的移动，此时有历史，先判断是否为回退：
      // 1. 先假定回退一步
      const circle = state.circles.pop();
      const point = state.polylines.pop();
      // 2. 若不满足回退条件，则恢复原来历史，然后记入新的移动
      if (!coordinateEquals(circle, [x, y])) {
        state.circles.push(circle);
        state.polylines.push(point);
        state.circles.push([...state.current]);
        state.polylines.push([...state.current]);
      } else {
        remove = [...state.current];
      }
    }

    // 更新当前的坐标位置
    state.current = [x, y];
    update([x, y], remove);

    if (state.current[0] === 4 && state.current[1] === 3) {
      setTimeout(() => {
        onSuccess();
      }, 300);
    }
  }

  /**
   * 重绘 UI 界面，若 append 和 remove 不指定，则完全重绘；如果 append 或 remove 指定，则增量更新
   * @param append - 新增的圆圈
   * @param remove - 删除的圆圈
   */
  function update(append = null, remove = null) {
    const [tiger, polyline] = findNamesByLayer(stage.layer, [
      'tiger',
      'polyline',
    ]);

    if (tiger) {
      const [x, y] = state.current;
      tiger.attr({ pos: configs.circle.coordinate[x][y] });
    }

    if (polyline) {
      const points = [];
      [...state.polylines, state.current].forEach(([x, y]) => {
        const pos = configs.polyline.coordinate[x][y];
        points.push(pos[0], pos[1]);
      });
      polyline.attr({ points });
    }

    // 完全重新绘制所有圆圈
    if (!append && !remove) {
      const selected = [],
        all = [];
      let circles = null;

      configs.circle.coordinate.forEach((rows, x) => {
        rows.forEach((c, y) => {
          all.push(`circle-${x}-${y}`);
        });
      });

      circles = findNamesByLayer(stage.layer, all);
      circles &&
        circles.forEach(c => {
          c.attr({ bgcolor: null, border: null });
        });

      [...state.circles, state.current].forEach(([x, y]) => {
        selected.push(`circle-${x}-${y}`);
      });

      circles = findNamesByLayer(stage.layer, selected);
      circles &&
        circles.forEach(c => {
          c.attr({
            bgcolor: configs.circle.color,
            border: [configs.circle.border.width, configs.circle.border.color],
          });
        });
    }

    // 增量绘制新增的圆圈
    if (append) {
      const [circle] = findNamesByLayer(stage.layer, [
        `circle-${append[0]}-${append[1]}`,
      ]);
      circle &&
        circle.attr({
          bgcolor: configs.circle.color,
          border: [configs.circle.border.width, configs.circle.border.color],
        });
    }

    // 增量绘制回退的圆圈
    if (remove) {
      const [circle] = findNamesByLayer(stage.layer, [
        `circle-${remove[0]}-${remove[1]}`,
      ]);
      circle && circle.attr({ bgcolor: null, border: null });
    }
  }

  function initPage() {
    setEles([
      createHorn('L0018'),
      createQuestionLabel('巧虎想去看大熊猫，请你试试看哪条路线才是正确的呢?'),
      {
        // 线
        type: EleTypeEnums.POLYLINE,
        option: {
          name: 'polyline',
          pos: [0, 0],
          points: [],
          strokeColor: configs.polyline.color,
          lineWidth: configs.polyline.width,
          smooth: true,
          zIndex: 20,
        },
      },
      {
        // Dragging Lines
        type: EleTypeEnums.POLYLINE,
        option: {
          name: 'walking',
          pos: [0, 0],
          points: [],
          strokeColor: configs.polyline.color,
          lineWidth: configs.polyline.width,
          smooth: true,
          zIndex: 21,
        },
      },
      {
        // 拖动，巧虎
        type: EleTypeEnums.SPRITE,
        option: {
          name: 'tiger',
          anchor: [0.5, 0.5],
          pos: [...configs.circle.coordinate[0][0]],
          size: [configs.tiger.width, configs.tiger.height],
          texture: qiao,
          zIndex: 99,
        },
      },
      {
        type: EleTypeEnums.SPRITE,
        option: {
          texture: bg,
          size: [configs.background.width, configs.background.height],
          pos: [...configs.background.coordinate],
        },
      },
      {
        type: EleTypeEnums.SPRITE,
        option: {
          name: 'backward',
          texture: back,
          size: [configs.backward.width, configs.backward.height],
          pos: [...configs.backward.coordinate],
        },
      },
      ...circles(),
    ]);

    function circles() {
      const nodes = [];
      const diameter = configs.circle.radius * 2;
      configs.circle.coordinate.forEach((rows, x) => {
        rows.forEach((cell, y) => {
          nodes.push({
            type: EleTypeEnums.BLOCK,
            option: {
              name: `circle-${x}-${y}`,
              anchor: [0.5, 0.5],
              size: [diameter, diameter],
              border: null,
              borderRadius: configs.circle.radius,
              bgcolor: null,
              pos: [...cell],
              zIndex: 21,
            },
          });
        });
      });
      return nodes;
    }
  }

  function onSuccess() {
    console.log('You have done!');
    setVisible(true)
  }

  return (
    <>
      <div id={elId} style={{ width: '100vw', height: '100vh' }} />
      <RewardModal visible={visible} star={getSessionStar()} onClose={onClose} />
    </>
  );
};
export default Delivery;
