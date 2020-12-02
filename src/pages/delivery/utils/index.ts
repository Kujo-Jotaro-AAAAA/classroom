import { BASE_WIDTH, BASE_HEIGHT } from '@/utils/detectOrient';
/**
 * @description 判定点位与原点的方位
 */
export function determineDirection(origin: number[], curr: number[]): string {
  return 'up';
}

/**
 * @description 生成标记好的点
 */
export function createMarks(): number[][] {
  const xs = [66, 267, 464, 662, 864],
    ys = [283, 408, 521, 645],
    pointers = [];
  for (let xi = 0; xi < xs.length; xi++) {
    const xPointer = xs[xi];
    for (let yi = 0; yi < ys.length; yi++) {
      const yPointer = ys[yi];
      pointers.push([xPointer, yPointer]);
    }
  }
  return pointers;
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
    truefalse: 3,
    falsefalse: 4,
  };
  return coordinateMap[key];
}
/**
 * @description 对比当前点与原点的x，y大小，获取距离远端相对位置。x > y
 * ! 浏览器的象限是倒转的, 1,2 <->3,4
 * 象限:
 * 1 x > y →，返回x和原点的y 否则↑, 返回原点x和y
 * 2 x > y ←，否则↑
 * 3 x > y ←，否则↓
 * 4 x > y →，否则↓
 * @param oPoint
 * @param currPonit
 * @param coordinate
 */
export function getPos(oPoint: PointerTypes, currPonit: PointerTypes) {
  const [ox, oy] = oPoint;
  const coordinate = getCoordinate(oPoint, currPonit);
  const [xDistance, yDistance] = getXYToList(oPoint, currPonit),
    isX = Math.abs(xDistance) > Math.abs(yDistance);
  const pos: [number, number] = isX ? [ox + xDistance , oy]: [ox, oy + yDistance]
  return {
    coordinate,
    pos,
  };
}
