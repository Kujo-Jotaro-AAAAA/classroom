/**
 * @description 页面描述
 */
import React, { FC, useState, useEffect, useRef } from 'react';
import { session } from '@/utils/store';
import * as spritejs from 'spritejs';
import RewardModal from '@/components/rewardModal';
import useStage from '@/hooks/useStage';
import useReward from '@/hooks/useReward';
import useComponents from '@/hooks/useComponents';
import useCreateEle, {
  ElesConfig,
  EleTypeEnums,
  EvtNameEnum,
} from '@/hooks/useCreateEle';
const { Sprite, Rect, Block, Label, Polyline, Path, Group } = spritejs;
const canvasId = 'record-container';
const assetsMap = {
  teacher: require('../assets/老师头像.png'),
  t_b: require('../assets/老师语音条@2x.png'),
  student: require('../assets/宝宝头像.png'),
  s_b: require('../assets/小朋友语音条@2x.png'),
  record: require('../assets/录音@2x.png'),
  reload: require('../assets/重录@2x.png'),
  send: require('../assets/发送@2x.png'),
  play: require('../assets/play@2x.png'),
  playLeft: require('../assets/play-left.png'),
};
interface PropTypes {}
// const sessionKey = 'optionPos';
// import { bAndCResultSession } from '../index';
const Record: FC<PropTypes> = function(props) {
  const { visible, setVisible, onClose } = useReward(),
    playRightRef = useRef(null),
    playLeftRef = useRef(null),
    completedBtnsRef = useRef(null);
  const answer = 'blue';
  // imgUrl = session.getKey(bAndCResultSession)
  const { stage } = useStage({
    elId: canvasId,
  });
  const {
    elements,
    setEles,
    findEleByName,
    findElesByNames,
    commonAnimate,
  } = useCreateEle({
    stage,
  });
  const { createQuestionLabel } = useComponents();
  useEffect(() => {
    initPage();
    return () => {
      // return session.clear();
    };
  }, []);
  useEffect(() => {
    if (!Array.isArray(elements) || elements.length === 0) return;
    console.log('elements', elements);
    if (findEleByName(elements, 'play-right')) {
      playRightRef.current = findEleByName(elements, 'play-right');
    }
    if (findEleByName(elements, 'play-left')) {
      playRightRef.current = findEleByName(elements, 'play-left');
    }
    if (findElesByNames(elements, ['reload', 'send']).length) {
      completedBtnsRef.current = findElesByNames(elements, ['reload', 'send']);
    }
  }, [elements]);
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
        },
      },
      {
        // 老师录音播放
        type: EleTypeEnums.SPRITE,
        option: {
          texture: assetsMap.t_b,
          size: [237, 72],
          pos: [727, 240],
        },
        evt: [
          {
            type: EvtNameEnum.CLICK,
            callback: (evt, elm) => {
              // 播放录音
              playRightRef.current.animate(
                [{ opacity: 0.1 }, { opacity: 0.5 }, { opacity: 1 }],
                {
                  ...commonAnimate,
                  iterations: 40,
                  fill: 'none',
                },
              );
            },
          },
        ],
      },
      {
        type: EleTypeEnums.LABEL,
        option: {
          text: '20 "',
          fontSize: 34,
          pos: [789, 255],
        },
      },
      {
        // 播放录音动效
        type: EleTypeEnums.SPRITE,
        option: {
          name: 'play-right',
          texture: assetsMap.play,
          size: [25, 34],
          pos: [752, 259],
          pointerEvents: 'none',
        },
      },
      createRecord(),
    ]);
  }

  /**
   * @description 录音按钮，点击了将自己隐藏
   */
  function createRecord() {
    return {
      type: EleTypeEnums.SPRITE,
      option: {
        name: 'record',
        texture: assetsMap.record,
        size: [80, 80],
        pos: [746, 577],
      },
      evt: [
        {
          type: EvtNameEnum.CLICK,
          callback: (evt, elm) => {
            // 开始录音
            voiceRecordStart.postMessage()
            elm.remove();
            // createRecordGroup()
            setEles([...createRecordingBtn()]);
          },
        },
      ],
    };
  }
  /**
   * @description 录音中的图标
   */
  function createRecordingBtn() {
    return [
      {
        type: EleTypeEnums.BLOCK,
        option: {
          size: [80, 80],
          pos: [746, 577],
          bgcolor: '#7A93FF',
          borderRadius: 40,
          // zIndex: 1,
        },
        evt: [
          {
            type: EvtNameEnum.CLICK,
            callback: (evt, elm) => {
              // 停止录音
              voiceRecordEnd.postMessage()
              elm.remove();
              setEles([...createRecordCompleteBtns(), ...createStudent()]);
            },
          },
        ],
      },
      {
        type: EleTypeEnums.BLOCK,
        option: {
          size: [33.42, 33.42],
          pos: [769, 600],
          bgcolor: '#fff',
          borderRadius: 3,
          pointerEvents: 'none',
        },
      },
    ];
  }
  /**
   * @description 学生录音
   */
  function createStudent(): ElesConfig[] {
    return [
      {
        type: EleTypeEnums.SPRITE,
        option: {
          texture: assetsMap.s_b,
          pos: [629, 391],
          size: [236.06, 72],
        },
        evt: [
          {
            type: EvtNameEnum.CLICK,
            callback: (evt, elm) => {
              // 播放录音
              voiceRecordPlay.postMessage()
              playLeftRef.current.animate(
                [{ opacity: 0.1 }, { opacity: 0.5 }, { opacity: 1 }],
                {
                  ...commonAnimate,
                  iterations: 40,
                  fill: 'none',
                },
              );
            },
          },
        ],
      },
      {
        type: EleTypeEnums.SPRITE,
        option: {
          texture: assetsMap.student,
          pos: [883, 387],
          size: [80, 80],
        },
      },
      {
        type: EleTypeEnums.LABEL,
        option: {
          text: '10"',
          fillColor: '#fff',
          fontSize: 30,
          pos: [776, 405],
        },
      },
      {
        // 播放录音动效
        type: EleTypeEnums.SPRITE,
        option: {
          name: 'play-left',
          texture: assetsMap.playLeft,
          size: [24, 31],
          pos: [829, 412],
          pointerEvents: 'none',
        },
      },
    ];
  }
  /**
   * @description 录音完毕后出现的重录和完成按钮
   */
  function createRecordCompleteBtns(): ElesConfig[] {
    return [
      {
        type: EleTypeEnums.SPRITE,
        option: {
          name: 'reload',
          texture: assetsMap.reload,
          pos: [665, 577],
          size: [80, 80],
        },
        evt: [
          {
            type: EvtNameEnum.CLICK,
            callback: (evt, elm) => {
              // 重新录制
              completedBtnsRef.current.forEach(el => {
                el.remove()
              })
              setEles([createRecord()])
            },
          },
        ],
      },
      {
        type: EleTypeEnums.SPRITE,
        option: {
          name: 'send',
          texture: assetsMap.send,
          pos: [828, 577],
          size: [80, 80],
        },
        evt: [
          {
            type: EvtNameEnum.CLICK,
            callback: (evt, elm) => {
              // 完成, 发送录音
            },
          },
        ],
      },
    ];
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
export default Record;
