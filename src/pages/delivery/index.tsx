/**
 * @description 页面描述
 */
import React, { FC, useState, useEffect, useRef } from 'react';
import { session } from '@/utils/store';
import RewardModal from '@/components/rewardModal';
import useStage from '@/hooks/useStage';
import useReward from '@/hooks/useReward';
import useComponents from '@/hooks/useComponents';
import useCreateEle, {
  ElesConfig,
  EleTypeEnums,
  EvtNameEnum,
} from '@/hooks/useCreateEle';
const canvasId = 'delivery-container'
interface PropTypes {}
const sessionKey = 'optionPos';
const Delivery: FC<PropTypes> = function(props) {
  const {visible, setVisible, onClose} = useReward()
  const answer = 'blue'
  const { stage } = useStage({
    elId: canvasId,
  });
  const { elements, setEles, eles } = useCreateEle({
    stage,
  });
  const {} = useComponents()
  useEffect(() => {
    initPage()
    return () => {
      return session.clear();
    };
  }, []);
  function initPage() {
    setEles([
      {
        type: EleTypeEnums.LABEL,
        option: {
          text: '页面题干!',
          fontSize: 34,
          pos: [61, 93],
        },
      },
      {
        type: EleTypeEnums.POLYLINE,
        option: {
          pos: [250, 50],
          points: [0, 0, 100, 100, 200, 0, 300, 100, 400, 0, 500, 100, 600, 0],
          strokeColor: 'blue',
          lineWidth: 3,
        }
      }
    ]);
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
export default Delivery
