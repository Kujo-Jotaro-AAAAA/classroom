import React, { useEffect, useState } from 'react';
import {history} from 'umi';
import TmpPage from './components/tmp';
import useComponents from '@/hooks/useComponents';
const partAssertMap = {
  question: require('@/assets/part/question.png'),
  first: require('@/assets/part/first.png'),
  center: require('@/assets/part/center.png'),
  last: require('@/assets/part/last.png'),
}
const gloveAssertMap = {
  question: require('@/assets/glove/center.png'),
  first: require('@/assets/glove/first.png'),
  center: require('@/assets/glove/center.png'),
  last: require('@/assets/glove/last.png'),
}
const RadioGroup: React.FC = function (props) {
  const [tmp, setTmp] = useState<string>()
  const { commonBlock } = useComponents();
  const assertMap = {
    part: {
      assert: partAssertMap,
      label: '哪个是和机器人零件一模一样的呢？点点看吧',
      answer: `${commonBlock}-0`,
      hornPath: 'L0008'
    },
    glove: {
      assert: gloveAssertMap,
      label: '哪个是和上面的手套一模一样的呢？点点看吧',
      answer: `${commonBlock}-1`,
      hornPath: 'L0010'
    }
  }
  useEffect(() => {
    // console.log('history',history.location.query.tmp);
    setTmp(history.location.query?.tmp)
  }, [])
  return <>
    {tmp && <TmpPage tmp={tmp} {...assertMap[tmp]} />}
  </>
}
export default RadioGroup
