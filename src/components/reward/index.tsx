/**
 * @description 职业类别
 */
import React, { FC, useState, useEffect, useRef } from 'react';
import * as spritejs from 'spritejs';
import useStage from '@/hooks/useStage';
import { ADD_COIN, PLAY_AUDIO} from '@/utils/bridge';
import {BASE_WIDTH, BASE_HEIGHT} from '@/utils/detectOrient';
import useReward from '@/hooks/useReward';
const { Scene, Sprite, Gradient, Rect, Block, Label } = spritejs;
const icon = require('@/assets/reward-gold.png');
const flyIcon = require('@/assets/fly-reward-gold.png');
const tigerIcon = require('@/assets/巧虎.png');
export interface PropTypes {
  star: 1 | 2 | 3; // 评分
  onCompleted?: () => void // 关闭
  // visible: boolean
  // onClose?: () => void
  audioConfig?: { // 音频选项
    exclude: string[]
  }
}
const Reward: FC<PropTypes> = function(props) {
  const { stage } = useStage({
    elId: 'container',
  });
  const { getCoinNum } = useReward()
  useEffect(() => {
    if (!stage) return;
    init();
  }, [stage]);
  useEffect(() => { // 播放对应的录音
    playAudios()
  }, [])
  function playAudios() {
    const playAudioMap = {
      3: 'L0020',
      2: 'L0021',
      1: 'L0022'
    };
    [playAudioMap[props.star], 'SE0002', 'SE0003'].forEach(name => {
          console.log('name', props.audioConfig?.exclude, name);
      if (Array.isArray(props.audioConfig?.exclude)) {
        if (props.audioConfig?.exclude.includes(name)) {

          return
        }
      }
      PLAY_AUDIO(name)
    })
  }
  /**
   * @description 初始化页面
   */
  async function init() {
    const assets = createDefaultAssets();
    const initTime = 300
    assets.doms.forEach(sp => {
      stage.layer.append(sp);
    });
    await setTimeout(() => {
      assets.animate.tiger.animate([
        {
          y: BASE_HEIGHT - 269 / 2 + 50
        },
        {
          y: BASE_HEIGHT - 269 / 2 - 50
        },
        {
          y: BASE_HEIGHT - 269 / 2
        },
      ], {
        duration: 500,
        easing: 'linear',
        direction: 'alternate',
        iterations: 1,
        fill: 'forwards',
      })
    }, initTime)
    await setTimeout(() => {
      assets.animate.stars.forEach(star => {
        star.animate([
          {opacity: .3},
          {opacity: .6},
          {opacity: 1},
        ], {
          duration: 500,
          easing: 'linear',
          direction: 'alternate',
          iterations: 1,
          fill: 'forwards',
        })
      })
    }, initTime + 300)
    await setTimeout(() => {
      assets.animate.addNum.animate([
          {opacity: .3},
          {opacity: .6},
          {opacity: 1},
        ], {
          duration: 500,
          easing: 'linear',
          direction: 'alternate',
          iterations: 1,
          fill: 'forwards',
        })
    }, initTime + 600)
    await setTimeout(() => {
      assets.animate.flyStar.animate(
        [
          { pos: [733, 362] },
          { pos: [842, 231] },
          { pos: [887, 109] },
          { pos: [894, 105] },
          { opacity: 0 },
        ],
        {
          duration: 1000,
          easing: 'linear',
          direction: 'alternate',
          iterations: 1,
          fill: 'forwards',
        },
      );
    }, initTime + 900)
    await setTimeout(() => {
      assets.animate.coin.attr('text', getCoinNum() + props.star)
      ADD_COIN(getCoinNum() + props.star)
      props.onCompleted && props.onCompleted()
    }, initTime + 1100)
  }
  /**
   * @description 加载页面
   */
  function createDefaultAssets() {
    const [mask, tiger, stars, countGroup, flyStar] = [
      createMask(),
      createTiger(),
      createStars(),
      createCountGroup(),
      createFlyStar(),
    ];
    const coin = countGroup[2];
    const addNum = countGroup[3];
    return {
      doms: [mask, tiger, ...stars, ...countGroup, flyStar],
      animate: {
        flyStar,
        coin,
        tiger,
        stars,
        addNum
      },
    };
  }
  function createMask() {
    return new Rect({
      posi: [0, 0],
      size: [BASE_WIDTH, BASE_HEIGHT],
      fillColor: '#6A6A6A',
      opacity: 0.64,
    });
  }
  function createTiger() {
    return new Sprite({
      texture: tigerIcon,
      size: [373, 269],
      anchor: [0.5, 0.5],
      // pos: [BASE_WIDTH / 2, BASE_HEIGHT - 269 / 2],
      pos: [BASE_WIDTH / 2, BASE_HEIGHT + 269]
    });
  }
  /**
   * @description 星星位置
   * 如果只有1个，居中
   * 2个平行，横向居中 分别向左右偏移55
   * 3个以基线，上下偏移半个金币的位置
   */
  function createStars() {
    const stars = [];
    for (let index = 1; index <= props.star; index++) {
      const w = 108,
        h = 105,
        centerW = BASE_WIDTH / 2,
        centerH = BASE_HEIGHT / 2 + 20;
      const xMap = {
          1: centerW,
          2: centerW + (index === 1 ? -(55 + w / 2) : 55 + w / 2),
          3:
            index === 2
              ? centerW
              : index === 1
              ? centerW + -(w + 70)
              : centerW + w + 70,
        },
        yMap = {
          1: centerH,
          2: centerH,
          3: index !== 2 ? centerH + h / 2 : centerH,
        };
      stars.push(
        new Sprite({
          texture: icon,
          size: [w, h],
          anchor: [0.5, 0.5],
          opacity: 0,
          pos: [xMap[props.star], yMap[props.star]],
        }),
      );
    }
    return stars;
  }
  function createFlyStar() {
    return new Sprite({
      texture: flyIcon,
      size: [30, 30],
      pos: [-100, -100],
      anchor: [0.5, 0.5],
      zIndex: 200,
    });
    // stage.layer.appendChild(flyStar)
  }
  function createCountGroup() {
    const groupX = 887;
    const groupY = 38;
    const bg = new Block({
      size: [76.68, 31],
      pos: [groupX, groupY],
      bgcolor: '#3B3B3B',
      opacity: .3,
      borderRadius: 16,
    });
    const star = new Sprite({
      texture: flyIcon,
      pos: [894, 41],
      size: [25, 25],
      // anchor: [0.5, 0.5],
    });
    const count = new Label({
      pos: [920, 43],
      fontSize: 18,
      text: `${getCoinNum() || 0}`,
      fillColor: '#fff',
    });
    const addNum = new Label({
      text: `＋${props.star}`,
      pos: [490 - 10, 270],
      fillColor: '#fff',
      opacity: 0,
      fontSize: 34,
    })
    return [bg, star, count, addNum];
  }
  return (
    <>
      <div
        id={'container'}
        style={{
          width: '100vw',
          height: '100vh',
        }}
      />
    </>
  );
};

export default Reward;
