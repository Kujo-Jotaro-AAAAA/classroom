import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import TmpPage from './components/tmp';
import useComponents from '@/hooks/useComponents';
import { ElesConfig, EleTypeEnums } from '@/hooks/useCreateEle';
const assertMap = {
  r: require('@/assets/radioGroupSimple/png0012.png'), // 胡萝卜
  m: require('@/assets/radioGroupSimple/png0013.png'), // 香菇
  c: require('@/assets/radioGroupSimple/png0014.png'), // 玉米
  sb: require('@/assets/radioGroupSimple/png0005.png'), // 草莓
  g: require('@/assets/radioGroupSimple/png0006.png'), // 葡萄
  ba: require('@/assets/radioGroupSimple/png0007.png'), // 香蕉
  br: require('@/assets/radioGroupSimple/png0008.png'), // 面包
};
export interface PageOptionItemTypes {
  optionElmInit: ElesConfig[];
  answer: string;
}
export interface PageOptionTypes {
  [propsName: string]: PageOptionItemTypes;
}
const RadioGroup: React.FC = function(props) {
  const [tmp, setTmp] = useState<string>(),
    { createQuestionLabel } = useComponents(),
    [pageOption, setPageOption] = useState<PageOptionTypes>();
  useEffect(() => {
    init();
  }, []);
  function init() {
    setPageOption({
      rmc: {
        optionElmInit: [
          createQuestionLabel('哪一组蔬菜是有规律排列的呢？点点看吧！'),
          ...createRMC(),
        ],
        answer: '0',
      },
      sgb: {
        optionElmInit: [
          createQuestionLabel('哪一组是有规律排列的呢？点点看吧！'),
          ...createSGB()
        ],
        answer: '1',
      },
    });
  }
  /**
   * @description 创建水果组1
   */
  function createRMC(): ElesConfig[] {
    const w = 62,
      h = 74;
    const list = [
      ['m', 'm', 'r', 'm', 'm', 'r', 'm', 'm', 'r'],
      ['r', 'm', 'r', 'r', 'r', 'r', 'r', 'm', 'r'],
    ];
    return list
      .map((opList, opIdx) => {
        return opList.map((tag, idx) => {
          const texture = assertMap[tag],
            x = 71 + (41 + w) * idx,
            y = opIdx === 0 ? 272 : 480;
          return {
            type: EleTypeEnums.SPRITE,
            option: {
              texture,
              size: [w, h],
              pos: [x, y],
              zIndex: 10,
              pointerEvents: 'none',
            },
          };
        });
      })
      ?.flat();
  }
  /**
   * @description 创建面包组
   */
  function createSGB(): ElesConfig[] {
    const w = 55,
      h = 41;
    // 水果
    const list = [
      ['sb','g','ba','sb', 'g', 'g','sb','g','ba'],
      ['sb','g','ba','sb','g','ba','sb','g','ba'],
    ]
      .map((opList, opIdx) => {
        return opList.map((tag, idx) => {
          const texture = assertMap[tag],
            x = 270 + (2 + w) * idx,
            y = opIdx === 0 ? 262 : 471;
          return {
            type: EleTypeEnums.SPRITE,
            option: {
              texture,
              size: [w, h],
              pos: [x, y],
              zIndex: 10,
              pointerEvents: 'none',
            },
          };
        });
      })
      ?.flat();
    // 面包
    const brx = 239,
      bry = [285, 494];
    const breads = bry.map(bry => {
      return {
        type: EleTypeEnums.SPRITE,
        option: {
          texture: assertMap.br,
          size: [546.68, 70.8],
          pos: [brx, bry],
          zIndex: 1,
          pointerEvents: 'none',
        },
      };
    });

    return [...list, ...breads];
  }
  useEffect(() => {
    setTmp(history.location.query?.tmp);
  }, []);
  return <>{tmp && <TmpPage {...pageOption[tmp]} />}</>;
};
export default RadioGroup;
