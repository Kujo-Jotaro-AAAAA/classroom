/**
 * @description 页面描述
 */
import React, { FC, useState, useEffect, useRef } from 'react';
import { session } from '@/utils/store';
import RewardModal from '@/components/rewardModal';
import useStage from '@/hooks/useStage';
import useReward from '@/hooks/useReward';
import useComponents from '@/hooks/useComponents';
import { create12Checkerboard, getDirection } from './utils';
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
  const {visible, setVisible, onClose} = useReward(),
  [fixAnchors, setFixAnchors] = useState([])
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
      },
      ...createMarks()
    ]);
  }
  /**
   * @description 生成标记好的点
   */
  function createMarks(): ElesConfig[] {
    const board = create12Checkerboard()
    setFixAnchors(board.anchors)
    return board.anchors.map(pos => {
      return {
        type: EleTypeEnums.BLOCK,
        option: {
          anchor: [.5, .5],
          size: [50, 50],
          border: [2, '#f40'],
          borderRadius: 25,
          pos
        }
      }
    })
  }
  function handleMoveEvent(evt, elm) {
    const move = getDirection([139, 229], [evt.x, evt.y])
    console.log('move', move);
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
