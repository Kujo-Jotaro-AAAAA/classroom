/**
 * @description 职业类别
 */
import React, { FC, useState, useEffect, useRef } from 'react';
import * as spritejs from 'spritejs';
import useStage from '@/hooks/useStage';

const { Scene, Sprite, Gradient, Rect, Block, Label } = spritejs;
const icon = require('@/assets/reward-gold.png');
const flyIcon = require('@/assets/fly-reward-gold.png');
const tigerIcon = require('@/assets/巧虎.png');
interface PropTypes {
  star: 1 | 2 | 3; // 评分
  // visible: boolean
  // onClose?: () => void
}
const vpWidth = window.innerWidth;
const vpHeight = window.innerHeight;
const Reward: FC<PropTypes> = function(props) {
  const { stage } = useStage({
    elId: 'container',
  });
  useEffect(() => {
    if (!stage) return;
    init();
  }, [stage]);
  /**
   * @description 初始化页面
   */
  async function init() {
    const assets = createDefaultAssets();
    assets.doms.forEach(sp => {
      stage.layer.append(sp);
    });
    await assets.animate.flyStar.animate(
      [
        { pos: [733, 362] },
        { pos: [842, 231] },
        { pos: [887, 109] },
        { pos: [894, 105] },
        { opacity: 0 },
      ],
      {
        duration: 1000,
        easing: 'ease-in',
        direction: 'alternate',
        iterations: 1,
        fill: 'forwards',
      },
    );
    await assets.animate.coin.animate([{ text: 18 + props.star }], {
      duration: 2500,
      iterations: 1,
      easing: 'ease-out',
      fill: 'forwards',
    });
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

    return {
      doms: [mask, tiger, ...stars, ...countGroup, flyStar],
      animate: {
        flyStar,
        coin,
      },
    };
  }
  function createMask() {
    return new Rect({
      posi: [0, 0],
      size: [vpWidth, vpHeight],
      fillColor: '#6A6A6A',
      opacity: 0.64,
    });
  }
  function createTiger() {
    return new Sprite({
      texture: tigerIcon,
      size: [373, 269],
      anchor: [0.5, 0.5],
      pos: [vpWidth / 2, vpHeight - 269 / 2],
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
        centerW = vpWidth / 2,
        centerH = vpHeight / 2 + 20;
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
      // pos: [-100, -100],
      anchor: [0.5, 0.5],
      zIndex: 200,
    });
    // stage.layer.appendChild(flyStar)
  }
  function createCountGroup() {
    const groupX = 887;
    const groupY = 38;
    const bg = new Block({
      size: [76.68, groupY],
      pos: [groupX, 38],
      bgcolor: '#3B3B3B',
      borderRadius: 16,
    });
    const star = new Sprite({
      texture: flyIcon,
      pos: [894, 41],
      size: [25, 25],
      // anchor: [0.5, 0.5],
    });
    const count = new Label({
      pos: [920, 41],
      fontSize: 18,
      text: 18,
      fillColor: '#fff',
    });
    return [bg, star, count];
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
