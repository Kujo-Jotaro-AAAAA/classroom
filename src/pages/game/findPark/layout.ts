import { ElesConfig, EleTypeEnums, EvtNameEnum } from '@/hooks/useCreateEle';
const answer = ['glass', 'rbt', 'car', 'eleph', 'kite']; // 答案
function replyNotice(assetsMap): ElesConfig[] {
  const greyBg: ElesConfig = {
    type: EleTypeEnums.BLOCK,
    option: {
      size: [793, 100],
      pos: [63, 142],
      bgcolor: '#EBEBEB',
      borderRadius: 8,
    },
  };
  const sizeMap = {
      // 图标尺寸
      [answer[0]]: [82, 53],
      [answer[1]]: [48, 84],
      [answer[2]]: [83, 63],
      [answer[3]]: [81, 60],
      [answer[4]]: [53, 69],
    },
    posMap = {
      [answer[0]]: [84, 166], // * 占位
      [answer[1]]: [267.75, 150],
      [answer[2]]: [417.5, 161],
      [answer[3]]: [585.25, 162],
      [answer[4]]: [766, 158],
    };
  const ans = answer
    .map((ans, idx) => {
      const currSize = sizeMap[ans],
        w = currSize[0],
        h = currSize[1],
        // + 上张图的尺寸
        x = posMap[ans][0],
        y = posMap[ans][1], // 图标位置
        // 背景圆框
        boxSize = 88,
        bx = 81 + (boxSize + 79) * idx,
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
    ...replyNotice(assetsMap),
    bg(assetsMap),
  ];
};
