import {isJSON, isJSONString} from './tool';
export const session = {
  setKey(key: string, value: any) {
    let str = value
    if (isJSON(value)) {
      str = JSON.stringify(value);
    }
    window.sessionStorage.setItem(key, str);
  },
  getKey(key: string) {
    const val = window.sessionStorage.getItem(key);
    if (isJSONString(val)) {
      return JSON.parse(val);
    }
    return val
  },
  clear() {
    window.sessionStorage.clear();
  },
  removeKey(key: string) {
    window.sessionStorage.removeItem(key)
  }
};
export const local = {
  setKey(key: string, value: any) {
    const str = JSON.stringify(value);
    window.localStorage.setItem(key, str);
  },
  getKey(key: string) {
    const val = window.localStorage.getItem(key);
    return JSON.parse(val);
  },
  clear() {
    window.localStorage.clear();
  },
  removeKey(key: string) {
    window.localStorage.removeItem(key)
  }
};
