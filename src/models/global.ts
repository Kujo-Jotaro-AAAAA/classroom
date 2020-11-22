// import * as globalService from '../services/global';
import { ModelType, DictList, DictItem } from './types.d'
import { history } from 'umi'
import { message } from 'antd'
import { merge } from 'lodash'
export interface GlobalStateType {

}
const Model: ModelType<GlobalStateType> = {
  namespace: 'global',
  state: {

  },
  reducers: {
    /**
     * @description 设置全局字典表
     * 修改对应的二级菜单
     * 当前的一级菜单角标
     * 打开菜单的 index[]
     */
    // setDictList(state, { payload: { dictList } }) {
    //   if (dictList && Object.keys(dictList).length) {
    //     // dictList 与原来的字典表浅合并
    //     const newDict = merge(state.dictList, dictList)
    //     state.dictList = newDict
    //   }
    // },
  },
  effects: {
    // *getDictList({ payload: { list }, callback }, { call, put, select }) {
    //   // 调用之前判断一下，原来的大字典表是否已将当前所传字段缓存
    //   const { dictList } = yield select(
    //     (store: { global: any }) => store.global
    //   )
    //   const dictKeys = Object.keys(dictList)
    //   if (list.length === 0) return
    //   const compare = arrCompare(dictKeys, list)
    //   if (!compare.status) {
    //     if (callback && typeof callback === 'function') callback(dictList)

    //     return
    //   } // 与原来一致，不调接口
    //   const { success, message: msg, value } = yield call(QueryDictList, {
    //     idList: compare.arr, // 只传多的字段
    //   })
    //   if (success) {
    //     const newDictList: { [propsName: string]: DictItem[] } = {}
    //     value.forEach((item: DictItem[], idx: number) => {
    //       if (Array.isArray(compare.arr)) {
    //         newDictList[compare.arr[idx]] = item
    //       }
    //     })
    //     yield put({
    //       type: 'setDictList',
    //       payload: {
    //         dictList: newDictList,
    //       },
    //     })
    //     if (callback && typeof callback === 'function') {
    //       callback(newDictList)
    //     }
    //   } else {
    //     yield message.error(msg)
    //   }
    // },
  },
  // subscriptions: {
  //   // 监听路由变更, 修改model 中当前路由的值,激活菜单
  //   listenRouter({ dispatch, history }) {
  //     // @ts-ignore
  //     history.listen(({ pathname }) => {
  //       if (pathname && pathname != '/login') {
  //         dispatch({
  //           type: 'setCurrPathname',
  //           payload: { currPathname: pathname },
  //         })
  //       }
  //     })
  //   },
  // },
}
export default Model
// 菜单设置 全局信息
// 使用方式 挂载全局
