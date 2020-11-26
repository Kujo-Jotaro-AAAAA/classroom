import { ElesConfig, EleTypeEnums, EvtNameEnum } from '@/hooks/useCreateEle';
const answer = ['glass', 'rbt', 'car', 'eleph', 'kite']; // 答案
function replyNotice(assetsMap): ElesConfig[] {
  const greyBg: ElesConfig = {
    type: EleTypeEnums.BLOCK,
    option: {
      size: [610, 100],
      pos: [243, 142],
      bgcolor: '#EBEBEB',
      borderRadius: 8,
    },
  };
  const sizeMap = {
      // 图标尺寸
      [answer[0]]: [81, 52],
      [answer[1]]: [48, 84],
      [answer[2]]: [83, 63],
      [answer[3]]: [81, 60],
      [answer[4]]: [78, 71],
    },
    posMap = {
      // 图标距离上个图标的x位置
      [answer[0]]: [256, 166], // * 占位
      [answer[1]]: [403, 150],
      [answer[2]]: [507, 161],
      [answer[3]]: [630, 162],
      [answer[4]]: [748, 161],
    };
  const ans = answer
    .map((ans, idx) => {
      const currSize = sizeMap[ans],
        preSize = idx > 0 ? sizeMap[answer[idx - 1]] : [0, 0],
        w = currSize[0],
        h = currSize[1],
        // + 上张图的尺寸
        x = posMap[ans][0],
        y = posMap[ans][1], // 图标位置
        // 背景圆框
        boxSize = 88,
        bx = 261 + (boxSize + 34) * idx,
        by = 148;
      return [
        {
          // 背景盒子
          type: EleTypeEnums.BLOCK,
          option: {
            pos: [bx, by],
            size: [boxSize, boxSize],
            borderRadius: boxSize / 2,
            bgcolor: '#fff',
          },
        },
        {
          // 图标
          type: EleTypeEnums.SPRITE,
          option: {
            texture: assetsMap[ans],
            pos: [x, y],
            size: [w, h],
          },
        },
      ];
    })
    .flat();
  return [greyBg, ...ans];
}
function bg(assetsMap): ElesConfig {
  return {
    type: EleTypeEnums.SPRITE,
    option: {
      texture: assetsMap.bg,
      size: [1024, 515],
      pos: [0, 253],
    },
  };
}

export default assetsMap => {
  return [
    {
      type: EleTypeEnums.LABEL,
      option: {
        text: '点点看吧！',
        fontSize: 34,
        pos: [61, 142],
      },
    },
    ...replyNotice(assetsMap),
    bg(assetsMap),
  ];
};
