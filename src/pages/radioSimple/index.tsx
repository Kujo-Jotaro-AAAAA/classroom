import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import TmpPage from './components/tmp';
import useComponents from '@/hooks/useComponents';
import { ElesConfig, EleTypeEnums, EvtNameEnum } from '@/hooks/useCreateEle';
const queryTmp = history.location.query?.tmp;
const assertMap = {
  // * 每个切图大小都不一致，弃用
  r: require('@/assets/radioGroupSimple/png0012.png'), // 胡萝卜
  m: require('@/assets/radioGroupSimple/png0013.png'), // 香菇
  c: require('@/assets/radioGroupSimple/png0014.png'), // 玉米
  // sb: require('@/assets/radioGroupSimple/png0005.png'), // 草莓
  // g: require('@/assets/radioGroupSimple/png0006.png'), // 葡萄
  // ba: require('@/assets/radioGroupSimple/png0007.png'), // 香蕉
  // br: require('@/assets/radioGroupSimple/png0008.png'), // 面包
  br1: require('@/assets/radioGroupSimple/cake1@2x.png'), // 有香蕉版本
  br2: require('@/assets/radioGroupSimple/cake2@2x.png'),
  br3: require('@/assets/radioGroupSimple/cake3@2x.png'), // 无香蕉版本
  br4: require('@/assets/radioGroupSimple/cake4@2x.png'),
  // 交通锥
  coneR: require('@/assets/radioGroupSimple/png0035.png'), // 红
  coneB: require('@/assets/radioGroupSimple/png0036.png'), // 蓝
  coneG: require('@/assets/radioGroupSimple/png0037.png'), // 绿
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
    { createQuestionLabel, createStep } = useComponents(),
    [pageOption, setPageOption] = useState<PageOptionTypes>();
  useEffect(() => {
    init();
  }, []);
  function createNav() {
    const stepMap = {
      cone: 1,
      rmc: 2,
      rmc2: 3
    }
    return createStep(stepMap[queryTmp])
  }
  function init() {
    setPageOption({
      rmc: {
        // 只有蘑菇和胡萝卜
        optionElmInit: [
          createQuestionLabel('哪一组蔬菜是有规律排列的呢？点点看吧！'),
          ...createRMC(),
        ],
        answer: '0',
      },
      rmc2: {
        // 蘑菇胡萝卜玉米
        optionElmInit: [
          createQuestionLabel('哪一组蔬菜是有规律排列的呢？点点看吧！'),
          ...createRMC2(),
        ],
        answer: '1',
      },
      sgb: {
        optionElmInit: [
          createQuestionLabel('哪一组是有规律排列的呢？点点看吧！'),
          ...createSGB(),
        ],
        answer: '1',
      },
      sgb2: {
        optionElmInit: [
          createQuestionLabel('哪一组是有规律排列的呢？点点看吧！'),
          ...createSGB2(),
        ],
        answer: '1',
      },
      cone: {
        optionElmInit: [
          createQuestionLabel('哪一组是有规律排列的呢？点点看吧！'),
          ...createNav(),
          ...createCone(),
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
   * @description 创建水果组2
   */
  function createRMC2(): ElesConfig[] {
    const w = 62,
      h = 74;
    const list = [
      ['m', 'c', 'r', 'm', 'r', 'c', 'm', 'c', 'r'],
      ['m', 'c', 'r', 'm', 'c', 'r', 'm', 'c', 'r'],
    ];
    return list
      .map((opList, opIdx) => {
        return opList.map((tag, idx) => {
          const texture = assertMap[tag],
            x = 80 + (41 + w) * idx,
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
    const w = 546.68, h = 93, posX = 239, posY = 263
    return ['br1', 'br2'].map((key, idx) => {
      return {
        type: EleTypeEnums.SPRITE,
        option: {
          texture: assertMap[key],
          size: [w, h],
          zIndex: 0,
          pointerEvents: 'none',
          pos: [posX, posY + (115 + h) * idx]
        },
      }
    })
  }
  /**
   * @description 创建面包组2
   */
  function createSGB2(): ElesConfig[] {
    const w = 546.68, h = 93, posX = 239, posY = 263
    return ['br3', 'br4'].map((key, idx) => {
      return {
        type: EleTypeEnums.SPRITE,
        option: {
          texture: assertMap[key],
          size: [w, h],
          zIndex: 0,
          pointerEvents: 'none',
          pos: [posX, posY + (115 + h) * idx]
        },
      }
    })
  }
  /**
   * @description 创建交通锥
   */
  function createCone(): ElesConfig[] {
    const w = 60,
      h = 67;
    const list = [
      [
        'coneR',
        'coneB',
        'coneG',
        'coneG',
        'coneR',
        'coneB',
        'coneR',
        'coneB',
        'coneG',
      ],
      [
        'coneR',
        'coneB',
        'coneG',
        'coneR',
        'coneB',
        'coneG',
        'coneR',
        'coneB',
        'coneG',
      ],
    ];
    return list
      .map((opList, opIdx) => {
        return opList.map((tag, idx) => {
          const texture = assertMap[tag],
            x = 96 + (37 + w) * idx,
            y = opIdx === 0 ? 276 : 485;
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
      .flat();
  }
  useEffect(() => {
    setTmp(queryTmp);
  }, []);
  return <>{tmp && <TmpPage {...pageOption[tmp]} />}</>;
};
export default RadioGroup;
