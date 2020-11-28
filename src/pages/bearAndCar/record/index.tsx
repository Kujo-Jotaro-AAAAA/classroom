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
const canvasId = 'record-container'
const assetsMap = {
  teacher: require('../assets/老师头像.png'),
  t_b: require('../assets/老师语音条@2x.png'),
  student: require('../assets/宝宝头像.png'),
  s_b: require('../assets/小朋友语音条@2x.png'),
  record: require('../assets/录音@2x.png'),
  reload: require('../assets/重录@2x.png'),
  send: require('../assets/发送@2x.png'),
  play: require('../assets/play@2x.png'),
}
interface PropTypes {}
// const sessionKey = 'optionPos';
// import { bAndCResultSession } from '../index';
const Record: FC<PropTypes> = function(props) {
  const {visible, setVisible, onClose} = useReward()
  const answer = 'blue'
  // imgUrl = session.getKey(bAndCResultSession)
  const { stage } = useStage({
    elId: canvasId,
  });
  const { elements, setEles, eles } = useCreateEle({
    stage,
  });
  const { createQuestionLabel } = useComponents()
  useEffect(() => {
    initPage()
    return () => {
      // return session.clear();
    };
  }, []);
  function initPage() {
    setEles([
      createQuestionLabel('你是按照什么规律来排列的呢？按下录音键说一说吧'),
      // { // 上一步操作的截图
      //   type: EleTypeEnums.SPRITE,
      //   option: {
      //     texture: imgUrl,
      //     size: [548, 421],
      //     pos: [61, 236]
      //   }
      // },
      {
        type: EleTypeEnums.SPRITE,
        option: {
          texture: assetsMap.teacher,
          size: [68, 63],
          pos: [633, 245],
        }
      },
      { // 老师录音播放
        type: EleTypeEnums.SPRITE,
        option: {
          texture: assetsMap.t_b,
          size: [237, 72],
          pos: [727, 240],
        },
        evt: [{
          type: EvtNameEnum.CLICK,
          callback: (evt, elm) => {
            // 播放录音
          }
        }]
      },
      {
        type: EleTypeEnums.SPRITE,
        option: {
          texture: assetsMap.record,
          size: [80, 80],
          pos: [746, 577],
        },
        evt: [{
          type: EvtNameEnum.CLICK,
          callback: (evt, elm) => {
            // 开始录音
          }
        }]
      },
      {
        type: EleTypeEnums.SPRITE,
        option: {
          texture: assetsMap.play,
          size: [80, 80],
          pos: [746, 577],
        },
        evt: [{
          type: EvtNameEnum.CLICK,
          callback: (evt, elm) => {
            // 开始录音
          }
        }]
      },
      {
        type: EleTypeEnums.GROUP,
        option: {
          texture: assetsMap.play,
          size: [80, 80],
          pos: [746, 577],
        },
        children: [{
           type: EleTypeEnums.BLOCK,
          option: {
            size: [10, 10],
            pos: [752, 266],
            bgcolor: '#333333',
            borderRadius: 5
          },
        }]
      },
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
export default Record
