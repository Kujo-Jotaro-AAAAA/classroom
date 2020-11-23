import React, { useEffect, useState } from 'react';
import {history} from 'umi';
import TmpPage from './components/tmp';
const partAssertMap = {
  question: require('@/assets/part/question.png'),
  first: require('@/assets/part/first.png'),
  center: require('@/assets/part/center.png'),
  last: require('@/assets/part/last.png'),
}
const RadioGroup: React.FC = function (props) {
  const [tmp, setTmp] = useState<string>()
  const assertMap = {
    part: {
      assert: partAssertMap,
      label: '哪个是和机器人零件一模一样的呢？点点看吧'
    }
  }
  useEffect(() => {
    console.log('history',history.location.query.tmp);
    setTmp(history.location.query?.tmp)
  }, [])
  return <>
    {tmp && <TmpPage assert={assertMap[tmp].assert} QLabel={assertMap[tmp].label} />}
  </>
}
export default RadioGroup
