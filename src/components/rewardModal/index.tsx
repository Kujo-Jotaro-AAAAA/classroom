/**
 * @description 职业类别
 */
import React, { FC, useEffect } from 'react';
import styles from './styles/index.less';
import Reward from '../reward';
import {NEXT_STEP} from '@/utils/bridge';
interface PropTypes {
  star: 1 | 2 | 3; // 评分
  visible: boolean;
  onClose?: () => void;
  needNextStep?: boolean // 是否需要调用原生, 默认需要
  reload?: boolean // 切换路由的时候无法更新页面, true会刷新页面
}
const ResultModal: FC<PropTypes> = function({ star, visible,reload, onClose, needNextStep = true }) {
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        closeModel()
      }, 3500)
    }
  }, [visible])
  function closeModel() {
    if (needNextStep) {
      NEXT_STEP()
      reload && location.reload()
    }
    onClose()
  }

  return (
    <>
      {visible && (
        <div className={styles['reward_modal']}
        // onClick={closeModel}
        >
          <Reward star={star} />
        </div>
      )}
    </>
  );
};

export default ResultModal;
