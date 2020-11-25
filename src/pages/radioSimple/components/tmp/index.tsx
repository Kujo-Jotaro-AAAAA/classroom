/**
 * @description 零件
 */
import React, { FC, useState, useEffect, useRef } from 'react';
import { session } from '@/utils/store';
import RewardModal from '@/components/rewardModal';
import useStage from '@/hooks/useStage';
import useReward from '@/hooks/useReward';
import { success_color,success_border, fail_color, main_color } from '@/utils/theme';
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
  const { visible, setVisible, onClose,setSessionReply, getSessionReply, clearSessionReply, getStarFn } = useReward();
  const optionElms = useRef([]);
  const { stage } = useStage({
    elId: canvasId,
  });
  const { createOptionsBlock, createHorn, createStep } = useComponents();
  const { elements, setEles, findElesByNames } = useCreateEle(
    {
      stage,
    },
  );
  useEffect(() => {
    initPage();
    return () => {
      console.log('清空');
      clearSessionReply()
    }
  }, []);
  function initPage() {
    setEles([
      createHorn(),
      ...createStep(0),
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
      const y = 244 + ((79 + h) * idx);
      return {
        type: EleTypeEnums.BLOCK,
        option: {
          name: `${key}`,
          size: [w, h],
          pos: [61, y],
          border: [2, main_color],
          borderRadius: 10,
          boxSizing: 'border-box'
        },
        evt: [{
          type: EvtNameEnum.CLICK,
          callback: (evt, elm) => {
            onSubmit(elm)
          }
        }]
      };
    });
    return box;
  }
  useEffect(() => {
    if (!Array.isArray(elements) || elements.length === 0) return;
    optionElms.current = findElesByNames(elements, ['0', '1'])
  }, [elements]);
  /**
   * @description 提交信息
   * @param elm
   */
  function onSubmit(elm) {
    if (props.answer == elm.name) {
      elm.attr('bgcolor', success_color)
      elm.attr({
        bgcolor: success_color,
        borderColor: success_border
      })
      setVisible(true)
      clearSessionReply()
      return
    }
    setSessionReply(getSessionReply() + 1)
    elm.attr({
      bgcolor: fail_color,
      borderColor: main_color
    })
    resetStatus()
  }
  function resetStatus() {
    setTimeout(() => {
      optionElms.current.forEach(opElm => {
        opElm.removeAttribute('bgcolor')
      })
    }, 1000)
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
      <RewardModal visible={visible} star={getStarFn(getSessionReply())} onClose={onClose} />
    </>
  );
};

export default Part;
