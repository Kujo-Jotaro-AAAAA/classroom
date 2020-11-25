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
              zIndex: 10
            },
          };
        });
      })
      ?.flat();
  }
  useEffect(() => {
    setTmp(history.location.query?.tmp);
  }, []);
  return <>{tmp && <TmpPage {...pageOption[tmp]} />}</>;
};
export default RadioGroup;