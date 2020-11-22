import React, { Component, useEffect, createContext } from 'react'
import { history } from 'umi'
import { DndProvider } from 'react-dnd';
// import HTMLBackend from 'react-dnd-html5-backend';
import {TouchBackend} from 'react-dnd-touch-backend';
// import detectOrient from '@/utils/detectOrient';
// import { DndProvider } from 'react-dnd-multi-backend';
// import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch'; // or any other pipeline
import styles from './index.less'
import 'animate.css'
function getDropTargetElementsAtPoint(x, y, dropTargets) {
return dropTargets.filter(t => {
  const rect = t.getBoundingClientRect()
  return (
    x >= rect.left &&
    x <= rect.right &&
    y <= rect.bottom &&
    y >= rect.top
  )
})
}
function Index(props) {
  useEffect(() => {
    // detectOrient();
  }, [])
  return (
  // @ts-ignore
    <DndProvider backend={TouchBackend} options={{
      enableTouchEvents: true,
      enableMouseEvents: false,
      getDropTargetElementsAtPoint
      // enableMouseEvents: true
    }}>
        <div className={styles['content']}>
          {props.children}
        </div>
    </DndProvider>
  )
}
export default Index
