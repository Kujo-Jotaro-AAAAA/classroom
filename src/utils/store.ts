export const session = {
  setKey(key: string, value: any) {
    const str = JSON.stringify(value);
    window.sessionStorage.setItem(key, str);
  },
  getKey(key: string) {
    const val = window.sessionStorage.getItem(key);
    return JSON.parse(val);
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
    const val = window.localStorage.get(key);
    return JSON.parse(val);
  },
  clear() {
    window.localStorage.clear();
  },
  removeKey(key: string) {
    window.localStorage.removeItem(key)
  }
};
