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
import config from 'config/config';
import { throttle } from 'lodash';
import React, { FC, useEffect, useRef } from 'react';
import { createMarks, getPos } from './utils';
const [bg, qiao, back] = [
    require('./assets/bg.png'),
    require('./assets/qiao@2x.png'),
    require('./assets/back@2x.png'),
];

const canvasId = 'delivery-container';
interface PropTypes { }
const sessionKey = 'optionPos';
const Delivery: FC<PropTypes> = function (props) {
    const { visible, setVisible, onClose } = useReward();

    const { stage } = useStage({
        elId: canvasId,
    });

    const { elements, setEles, findNamesByLayer } = useCreateEle({
        stage,
    });

    const { createHorn, createQuestionLabel } = useComponents();

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

        // setTimeout(() => {
        //     commit([1, 0]);
        // }, 1000);

        // setTimeout(() => {
        //     commit([1, 1]);
        // }, 2000);

        // setTimeout(() => {
        //     commit([2, 1]);
        // }, 3000);
    }, [stage?.layer, elements]);

    const configs = {
        circle: {
            coordinate: [
                [[112, 330], [112, 455], [112, 568], [112, 692]],
                [[313, 330], [313, 455], [313, 568], [313, 692]],
                [[510, 330], [510, 455], [510, 568], [510, 692]],
                [[709, 330], [709, 455], [709, 568], [709, 692]],
                [[910, 330], [910, 455], [910, 568], [910, 692]],
            ],
            radius: 46,
            border: { color: '#F69472', width: 2 },
            color: '#FFEEE4',
        },
        blocks: [[0, 1], [1, 2], [2, 0], [2, 2], [2, 3], [3, 3], [4, 1]],
        polyline: {
            coordinate: [
                [[112, 323], [112, 448], [112, 575], [112, 691]],
                [[312, 323], [312, 448], [312, 575], [312, 691]],
                [[511, 323], [511, 448], [511, 575], [511, 691]],
                [[712, 323], [712, 448], [712, 575], [712, 691]],
                [[910, 323], [910, 448], [910, 575], [910, 691]],
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
        }
    }

    const state = {
        circles: [],
        polylines: [],
        current: null,
    }

    let isEventBinded = false;
    let isTouchMoveEnabled = true;

    function bindEvents() {
        const [tiger] = findNamesByLayer(stage.layer, ['tiger']);
        if (tiger && !isEventBinded) {
            tiger.addEventListener(EvtNameEnum.TOUCH_START, onTouchStarted);
            tiger.addEventListener(EvtNameEnum.TOUCH_MOVE, throttle(onTouchMoving, 50));
            tiger.addEventListener(EvtNameEnum.TOUCH_END, onTouchEnded);
            isEventBinded = true;
        }
    }


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
    function getQuadrant(pos, { center, top, bottom, left, right }) {
        const delta = 25;
        const [anchorX, anchorY] = center;
        const [posX, posY] = pos;

        if (posX < anchorX - delta) {
            if (posY < anchorY - delta) {
                return 1;
            } else if (posY > anchorY + delta) {
                return 7;
            } else {
                if (left > 0 && posX < left + delta) {
                    return 13;
                } else {
                    return 4;
                }
            }
        } else if (posX > anchorX + delta) {
            if (posY < anchorY - delta) {
                return 3;
            } else if (posY > anchorY + delta) {
                return 9;
            } else {
                if (right > 0 && posX > right - delta) {
                    return 11;
                } else {
                    return 6;
                }
            }
        } else {
            if (posY < anchorY - delta) {
                if (top > 0 && posY < top + delta) {
                    return 10;
                } else {
                    return 2;
                }
            } else if (posY > anchorY + delta) {
                if (bottom > 0 && posY > bottom - delta) {
                    return 12;
                } else {
                    return 8;
                }
            } else {
                return 5;
            }
        }
    }

    function getAroundCoordinates() {
        const [x, y] = state.current;
        return {
            center: configs.circle.coordinate[x][y],
            top: y === 0 ? 0 : configs.circle.coordinate[x][y - 1][1],
            bottom: y === 3 ? 0 : configs.circle.coordinate[x][y + 1][1],
            left: x === 0 ? 0 : configs.circle.coordinate[x - 1][y][0],
            right: x === 4 ? 0 : configs.circle.coordinate[x + 1][y][0],
        }
    }

    function isBlock(posX, posY) {
        let ret = false;
        configs.blocks.forEach(([x, y]) => {
            if (posX === x && posY === y) {
                ret = true;
            }
        });
        return ret;
    }

    function onTouchStarted() {
        isTouchMoveEnabled = true;
    }

    function onTouchMoving(e) {
        if (!isTouchMoveEnabled) return;

        const [tiger, walking] = findNamesByLayer(stage.layer, ['tiger', 'walking']);
        const [x, y] = state.current;
        const [anchorX, anchorY] = configs.circle.coordinate[x][y];
        const [polyX, polyY] = configs.polyline.coordinate[x][y];
        const quadrant = getQuadrant([e.x, e.y], getAroundCoordinates());

        function revert() {
            tiger.attr({ pos: [anchorX, anchorY] });
            walking.attr({ points: [] });
        }

        function moveHorizontal() {
            tiger.attr({ pos: [e.x, anchorY] });
            walking.attr({ points: [polyX, polyY, e.x, polyY] });
        }

        function moveVertical() {
            tiger.attr({ pos: [anchorX, e.y] });
            walking.attr({ points: [polyX, polyY, polyX, e.y] });
        }

        if (tiger && walking) {
            switch (quadrant) {
                case 2:
                    moveVertical();
                    break;
                case 6:
                    moveHorizontal();
                    break;
                case 8:
                    moveVertical();
                    break;
                case 4:
                    moveHorizontal();
                    break;
                case 11:
                    if (isBlock(x + 1, y)) {
                        revert();
                        isTouchMoveEnabled = false;
                    } else {
                        moveHorizontal();
                        commit([x + 1, y]);
                    }
                    break;
                case 10:
                    if (isBlock(x, y - 1)) {
                        revert();
                        isTouchMoveEnabled = false;
                    } else {
                        moveVertical();
                        commit([x, y - 1]);
                    }
                    break;
                case 13:
                    if (isBlock(x - 1, y)) {
                        revert();
                        isTouchMoveEnabled = false;
                    } else {
                        moveHorizontal();
                        commit([x - 1, y]);
                    }
                    break;
                case 12:
                    if (isBlock(x, y + 1)) {
                        revert()
                        isTouchMoveEnabled = false;
                    } else {
                        moveVertical();
                        commit([x, y + 1]);
                    }
                    break;
                default:
                    revert();
                    break;
            }
        }
    }

    function onTouchEnded() {
        const [tiger, walking] = findNamesByLayer(stage.layer, ['tiger', 'walking']);
        const [x, y] = state.current;
        const [anchorX, anchorY] = configs.circle.coordinate[x][y];
        tiger.attr({ pos: [anchorX, anchorY] });
        walking.attr({ points: [] });
    }

    function equals(pos1, pos2) {
        if (pos1 === null || pos2 === null) {
            return false;
        }

        return (pos1[0] === pos2[0] && pos1[1] === pos2[1])
    }

    function init([x, y]) {
        state.current = [x, y];
        state.circles = [];
        state.polylines = [];
        update();
    }

    function commit([x, y]) {
        if (!equals([x, y], state.current)) {
            if (state.circles.length === 0) {
                state.circles.push([...state.current]);
                state.polylines.push([...state.current]);
                state.current = [x, y];
            } else {
                const circles = state.circles.pop();
                const point = state.polylines.pop();
                console.log(circles, x, y);
                if (circles[0] === x && circles[1] === y) {
                    state.current = [x, y];
                } else {
                    state.circles.push(circles);
                    state.polylines.push(point);
                    state.circles.push([...state.current]);
                    state.polylines.push([...state.current]);
                    state.current = [x, y];
                }
            }
            console.log(state.circles.length)
            update();
        }
    }

    function update() {
        const names = ['tiger', 'polyline'];
        [...state.circles, state.current].forEach(([x, y]) => {
            names.push(`circle-${x}-${y}`);
        });

        const [tiger, polyline, ...circles] = findNamesByLayer(stage.layer, names);

        if (tiger) {
            const pos = state.current;
            tiger.attr({ pos: configs.circle.coordinate[pos[0]][pos[1]] });
        }

        if (polyline) {
            const points = [];
            [...state.polylines, state.current].forEach(([x, y]) => {
                const pos = configs.polyline.coordinate[x][y];
                points.push(pos[0], pos[1]);
            });
            polyline.attr({ points });
        }

        // 此处要优化
        const all = [];
        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 4; y++) {
                all.push(`circle-${x}-${y}`);
            }
        }

        findNamesByLayer(stage.layer, all).forEach(c => {
            c.attr({
                bgcolor: null,
                border: null,
            })
        })

        if (circles) {
            circles.forEach(c => {
                c.attr({
                    bgcolor: configs.circle.color,
                    border: [configs.circle.border.width, configs.circle.border.color],
                });
            });
        }
    }

    function circles() {
        const settings = [];
        const diameter = configs.circle.radius * 2;
        configs.circle.coordinate.forEach((rows, x) => {
            rows.forEach((cell, y) => {
                settings.push({
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
                })
            })
        })
        return settings;
    }

    function initPage() {
        setEles([
            createHorn(),
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
                // 线
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
                    texture: back,
                    size: [configs.backward.width, configs.backward.height],
                    pos: [...configs.backward.coordinate],
                },
                evt: [{
                    type: EvtNameEnum.CLICK,
                    callback: () => {
                        reset()
                    }
                }]
            },
            ...circles(),
        ]);
    }

    /**
     * @description 重置页面
     */
    function reset() {
        location.reload()
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
