/**
 * @description 零件
 */
import React, { FC, useState, useEffect, useRef } from 'react';
import { session } from '@/utils/store';
import RewardModal from '@/components/rewardModal';
import useStage from '@/hooks/useStage';
import useReward from '@/hooks/useReward';
import { success_color, fail_color } from '@/utils/theme';
import useCreateEle, {
  ElesConfig,
  EleTypeEnums,
  EvtNameEnum,
  EleEventTypes,
} from '@/hooks/useCreateEle';
import useComponents from '@/hooks/useComponents';
import {PageOptionItemTypes} from '../../index';
const canvasId = 'tmp-container';
interface PropTypes extends PageOptionItemTypes{
  // assert: { // 静态资源
  //   [propsName: string] : string
  // },
  // label: string // 题干
  // answer: string
}
const Part: FC<PropTypes> = function(props) {
  const { visible, setVisible, onClose } = useReward();
  const optionElms = useRef([]);
  const { stage } = useStage({
    elId: canvasId,
  });
  const { createOptionsBlock, createHorn, commonBlock } = useComponents();
  const { elements, setEles, resetElmsAttr, payloadEvtsByNames } = useCreateEle(
    {
      stage,
    },
  );
  const {answer} = props
  // const answer = `${commonBlock}-0`;
  useEffect(() => {
    initPage();
    return () => {
      // return session.clear();
    };
  }, []);
  function initPage() {
    setEles([
      createHorn(),
      ...props.optionElmInit,
      // 选项区
      ...createOptionsBox(),
    ]);
  }

  /**
   * @description 选项区暂位盒子
   */
  function createOptionsBox(): ElesConfig[] {
    const arr = [0, 1];
    const box = arr.map((key, idx) => {
      const w = 930, h = 130;
      const y = 244 + (79 + h * idx);
      return {
        type: EleTypeEnums.BLOCK,
        option: {
          name: key,
          size: [w, h],
          pos: [61, y],
        },
      };
    });
    return box;
  }
  useEffect(() => {
    if (!Array.isArray(elements) || elements.length === 0) return;

  }, [elements]);
  function onSubmit(el) {

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

export default Part;
