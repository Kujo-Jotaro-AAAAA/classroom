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
}
const ResultModal: FC<PropTypes> = function({ star, visible, onClose }) {
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        closeModel()
      }, 5000)
    }
  }, [visible])
  function closeModel() {
    NEXT_STEP()
    onClose()
  }

  return (
    <>
      {visible && (
        <div className={styles['reward_modal']} onClick={closeModel}>
          <Reward star={star} />
        </div>
      )}
    </>
  );
};

export default ResultModal;
