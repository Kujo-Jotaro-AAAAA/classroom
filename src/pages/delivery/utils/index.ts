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
  vp: [number, number] = [window.innerWidth, window.innerHeight],
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
    pointers,
    equalW,
    equalH,
    anchors,
  };
}

/**
 * 根据cos计算出斜角点直角需要移动的距离
 * @param point
 */
export function getCosLength(point: [number, number]) {}
