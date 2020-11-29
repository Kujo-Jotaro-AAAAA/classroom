import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import TmpPage from './components/tmp';
import useComponents from '@/hooks/useComponents';
import { ElesConfig, EleTypeEnums } from '@/hooks/useCreateEle';
const queryTmp = history.location.query?.tmp;
const assertMap = {
  colorKey: [
    require('@/assets/keys/1.png'),
    require('@/assets/keys/2.png'),
    require('@/assets/keys/3.png'),
    require('@/assets/keys/4.png'),
    require('@/assets/keys/5.png'),
    require('@/assets/keys/1.png'),
  ],
  robot: [
    require('@/assets/keys/机器人1@2x.png'),
    require('@/assets/keys/png0050@2x.png'),
    require('@/assets/keys/png0051@2x.png'),
    require('@/assets/keys/png0051@2x.png'),
    require('@/assets/keys/png0052@2x.png'),
    require('@/assets/keys/png0053@2x.png'),
  ],
};
export interface PageOptionItemTypes {
  optionElmInit: ElesConfig[];
  answer: number[];
  pushState: string
}
export interface PageOptionTypes {
  [propsName: string]: PageOptionItemTypes;

}
const RadioGroup: React.FC = function(props) {
  const { createQuestionLabel } = useComponents(),
    [pageOption, setPageOption] = useState<PageOptionTypes>();
  useEffect(() => {
    init();
  }, []);
  function init() {
    setPageOption({
      colorKey: {
        // 只有蘑菇和胡萝卜
        optionElmInit: [
          createQuestionLabel('哪两把钥匙是一模一样的呢？点点看吧'),
          ...createImgs(),
        ],
        answer: [0, 5],
        pushState: '/multiplechoice?tmp=robot'
      },
      robot: {
        optionElmInit: [
          createQuestionLabel('哪两个机器人是一模一样的呢？点点看吧'),
          ...createImgs(),
        ],
        answer: [2, 3],
        pushState: undefined
      },
    });
  }
  function createImgs(): ElesConfig[] {
    // const xs = [293, 494, 681],
    //   ys = [249, 463];
    const xsMap = {
        colorKey: [293, 494, 681],
        robot: [273, 466, 659],
      },
      ysMap = {
        colorKey: [249, 463],
        robot: [250, 464],
      };
    const posList = ysMap[queryTmp]
      .map(y => {
        return xsMap[queryTmp].map(x => {
          return [x, y];
        });
      })
      .flat();
    return assertMap[queryTmp].map((url, idx) => {
      const sizeMap = {
        colorKey: [52, 111],
        robot: [93, 109],
      };
      return {
        type: EleTypeEnums.SPRITE,
        option: {
          texture: url,
          pos: posList[idx],
          size: sizeMap[queryTmp],
          pointerEvents: 'none'
        },
      };
    });
  }
  return (
    <>
      {pageOption && pageOption[queryTmp] && (
        <TmpPage {...pageOption[queryTmp]} />
      )}
    </>
  );
};
export default RadioGroup;
