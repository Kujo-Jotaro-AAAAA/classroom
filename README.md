# SpriteJS

## 类型

### Block

### 使用
```ts
const block = new Block({
  size: [w, h],
  pos: [x, y],
  bgcolor: '#fff',
})
```
## 继承来的node属性

`el.name` : 目前看来是给组件绑定的唯一标识

`el.removeAttribute` 重置某个类型为初始状态

```ts
block.removeAttribute('bgcolor')
```
