/**
 * @description 页面描述
 */
import React, { FC, useState, useEffect, useRef } from 'react';
import { session } from '@/utils/store';
import RewardModal from '@/components/rewardModal';
import useStage from '@/hooks/useStage';
import useReward from '@/hooks/useReward';
import useComponents from '@/hooks/useComponents';
import {Toast} from 'zarm';
import useCreateEle, {
  ElesConfig,
  EleTypeEnums,
  EvtNameEnum,
} from '@/hooks/useCreateEle';
import {success_border} from '@/utils/theme';
import { BASE_WIDTH } from '@/utils/detectOrient';
const canvasId = 'bridge-container'
interface PropTypes {}
const sessionKey = 'optionPos';
const Bridge: FC<PropTypes> = function(props) {
  const {visible, setVisible, onClose} = useReward()
  const answer = 'blue'
  const { stage } = useStage({
    elId: canvasId,
  });
  const { elements, setEles, eles } = useCreateEle({
    stage,
  });
  const bridgeMap = {
    onBackPress: () =>  onBackPress(),
    voiceRecordStart: () => voiceRecordStart(),
    voiceRecordEnd: () => voiceRecordEnd(),
    voiceRecordPlay: () => voiceRecordPlay(),
    nextStep: () => nextStep(),
  }
  const {} = useComponents()
  useEffect(() => {
    initPage()
    return () => {
      return session.clear();
    };
  }, []);
  function initPage() {
    setEles([
      ...createBridgeBlock()
    ]);
  }
  function createBridgeBlock() {
    return Object.keys(bridgeMap).map((fnName, i) => {
      const y = 20 + (100 * i), w = 300
      return [
        {
          type: EleTypeEnums.BLOCK,
          option: {
            fontSize: 34,
            pos: [BASE_WIDTH/ 2 - w / 2, y],
            size: [w, 50],
            border: [2, success_border]
          },
          evt: [{
            type: EvtNameEnum.CLICK,
            callback: () => {
              try {
                bridgeMap[fnName]()
                alert(`调用${fnName}`)
              } catch (error) {
                alert(error);
              }
            }
          }]
        },
        {
          type: EleTypeEnums.LABEL,
          option: {
            text: fnName,
            fontSize: 34,
            pos: [BASE_WIDTH/ 2 - w / 2, y],
            porinterEvent: 'none',
            zIndex: -1
          },
        }
      ]
    }).flat()
  }
  useEffect(() => {
    if (!Array.isArray(elements) || elements.length === 0) return;
  }, [elements]);
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
export default Bridge
