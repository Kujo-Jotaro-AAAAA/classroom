import { BASE_WIDTH, BASE_HEIGHT } from '@/utils/detectOrient';
/**
 * @description 判定点位与原点的方位
 */
export function determineDirection(origin: number[], curr: number[]): string {
  return 'up';
}

/**
 * @description 生成12宫格棋盘, 依据point数量等分vp生成网格的坐标系
 * 范围坐标系[x, y]的二维数组, 及等分的尺寸
 * @param vp 视口[宽，高]
 */
export function create12Checkerboard(
  vp: [number, number] = [BASE_WIDTH, BASE_HEIGHT],
) {
  const copiesW = 4,
    copiesH = 3,
    [vpW, vpH] = vp,
    equalW = vpW / copiesW,
    equalH = vpH / copiesH,
    pointers = [],
    anchors = [];
  for (let x = 0; x < copiesW; x++) {
    for (let y = 0; y < copiesH; y++) {
      pointers.push([x, y]);
      anchors.push([equalW + x * equalW, equalH + equalH * y]);
    }
  }
  return {
    pointers, // 点位
    equalW, // 等宽
    equalH, // 等高
    anchors, // 锚点
  };
}
type PointerTypes = [number, number];
/**
 * @description 获取与原点的距离xy
 * @param oPoint
 * @param currPonit
 * @returns [x, y]
 */
export function getXYToList(oPoint: PointerTypes, currPonit: PointerTypes) {
  return currPonit.map((p, idx) => {
    return p - oPoint[idx];
  });
}
/**
 * @description 解析 getXYToList 出来的点位
 * @param oPoint 原点
 * @param currPonit 当前点
 * @returns [boolean, boolean]
 */
export function getCoordinateToList(
  oPoint: PointerTypes,
  currPonit: PointerTypes,
) {
  return getXYToList(oPoint, currPonit).map(p => Math.sign(p) > 0);
}

/**
 * @description 通过getCoordinateToList方法解析四象限
 * 象限决定了方向:
 * 1: ↑→
 * 2: ↑←
 * 3: ←↓
 * 4: ↓→
 * @param coordinate
 */
export function getCoordinate(oPoint: PointerTypes, currPonit: PointerTypes) {
  const key = getCoordinateToList(oPoint, currPonit).join('');
  const coordinateMap = {
    truetrue: 1,
    falsetrue: 2,
    falsefalse: 3,
    truefalse: 4,
  };
  return coordinateMap[key];
}
/**
 * @description 对比当前点与原点的x，y大小，获取行进方向。x > y
 * 象限:
 * 1 x > y →，返回x和原点的y 否则↑, 返回原点x和y
 * 2 x > y ←，否则↑
 * 3 x > y ←，否则↓
 * 4 x > y →，否则↓
 *
 * @param oPoint
 * @param currPonit
 * @param coordinate
 */
export function getDirection(oPoint: PointerTypes, currPonit: PointerTypes) {
  const [ox, oy] = oPoint;
  const coordinate = getCoordinate(oPoint, currPonit);
  const [x, y] = getXYToList(oPoint, currPonit),
    isX = x > y;
  // console.log('获取行进方向', '象限', coordinate, x, y);
  // const pos = [1, 2].includes(coordinate) ?
  const posMap = {
    1: isX ? [x, oy] : [ox, y],
    2: isX ? [-x, oy] : [ox, y],
    3: isX ? [-x, oy] : [ox, -y],
    4: isX ? [x, oy] : [ox, -y],
  };
  return {
    coordinate,
    pos: posMap[coordinate],
  };
}
/**
 * @description 获取点到点拖动的距离(貌似不需要)
 */
export function getDistance() {}
