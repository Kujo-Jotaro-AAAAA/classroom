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



## 枚举

```ts
import useCreateEle, {
  ElesConfig, // 配置表的类型
  EleTypeEnums, // 配置元素的类型
  EvtNameEnum, // 元素挂载方法种类
  EleEventTypes, // 方法的参数类型
} from '@/hooks/useCreateEle';
```



## 通用工具函数

### useCreateEle

创建元素的`hook` , 以及暴露出来的工具函数

```ts
const { elements, setEles, resetElmsAttr, payloadEvtsByNames } = useCreateEle(
    {
      stage,
    },
);
```

- ` setEles` : 配置出页面的元素

```ts
setEles([
  {
    type: EleTypeEnums.LABEL,
    option: {
      text: '题干说明',
      fontSize: 34,
      pos: [61, 93],
    },
  },
  {
    type: EleTypeEnums.SPRITE,
    option: {
      texture: question,
      pos: [469, 246.29],
      size: [85.57, 85.56],
    },
  },
  // 选项区
  ...createOptionsParts(),
  ...createOptionsBlock(3),
]);
```



- `elements` : 携带了 `setEles` 创建出来的所有元素信息

- `resetElmsAttr`: 重置元素的属性

```ts
resetElmsAttr(elements, ['bgcolor']);
```

- `payloadEvtsByNames` : 给元素挂载事件并返回对应的元素信息

```ts

const optionElms = useRef()
optionElms.current = payloadEvtsByNames(elements, blocks, [
  {
    type: EvtNameEnum.CLICK,
    callback: (evt, el) => {
      onSubmit(el);
    },
  },
]);
```

