/**
 * @description 页面描述
 */
import React, { FC, useState, useEffect, useRef } from 'react';
import { session } from '@/utils/store';
import RewardModal from '@/components/rewardModal';
import useStage from '@/hooks/useStage';
import useReward from '@/hooks/useReward';
import useComponents from '@/hooks/useComponents';
import { create12Checkerboard } from './utils';
import useCreateEle, {
  ElesConfig,
  EleTypeEnums,
  EvtNameEnum,
} from '@/hooks/useCreateEle';
const [placeholderImg] = [require('@/assets/重播按钮.png')]
const canvasId = 'delivery-container'
interface PropTypes {}
const sessionKey = 'optionPos';
const Delivery: FC<PropTypes> = function(props) {
  const {visible, setVisible, onClose} = useReward()
  const answer = 'blue',
  originPos = [50, 50] // 起始点
  const lineRef = useRef<any>(null)
  const { stage } = useStage({
    elId: canvasId,
  });
  const { elements, setEles, findEleByName } = useCreateEle({
    stage,
  });
  // const {} = useComponents()
  useEffect(() => {
    const board = create12Checkerboard()
    console.log('board ==>', board);
    initPage()
    return () => {
      return session.clear();
    };
  }, []);
  useEffect(() => {
    if (!Array.isArray(elements) || elements.length === 0) return;
    lineRef.current = findEleByName(elements, 'line')
  }, [elements]);
  function initPage() {
    setEles([
      {
        type: EleTypeEnums.POLYLINE,
        option: {
          name: 'line',
          pos: originPos,
          points: originPos,
          strokeColor: 'blue',
          lineWidth: 3,
        }
      },{
        type: EleTypeEnums.SPRITE,
        option: {
          name: 'move',
          anchor: [.5, .5],
          pos: originPos,
          size: [100,100],
          texture: placeholderImg
        },
        evt: [{
          type: EvtNameEnum.TOUCH_MOVE,
          callback: handleMoveEvent
        }]
      }
    ]);
  }
  /**
   * @description 生成标记好的点
   */
  function createMarks() {
    [
      [originPos], []
    ]
  }
  function handleMoveEvent(evt, elm) {
    elm.attr({
      pos: [evt.x, originPos[1]]
    })
    lineRef.current.attr('points', [...originPos, evt.x, originPos[1]])
    console.log(lineRef.current.attr('points'));
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
export default Delivery
