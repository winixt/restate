# Restate

Restate 是一个可以实现状态共享的 react hooks。

## 特性

* 通过调用一个 hooks 函数就可以在 `Function Component` 之间共享`state`，不需要 connect 等高阶组件的包裹。
* 鼓励代码模块化，每一份数据有属于它的模块，不与其他数据混淆
* 统一数据处理，遵循 redux 思想
* 轻量

## 用法

### 初始化 hooks
声明一个包含 `state` `reducers` `effects`(可选) 三个属性的对象。使用 `restate` 将其包装成一个 hooks。

```javascript
// useCount.js
import {createShareStateHook} from 'restate';
const count = {
    // 需要在多个组件间贡献的 state
    state: {
        count: 0,
        name: '罗宾'
    },
    // reducers 同步数据变更
    reducers: {
        increment: (state, payload) => Object.assign({}, state, {count: state.count + payload}),
        decrement: (state, payload) => Object.assign({}, state, {count: state.count - payload}),
        changeName: (state, payload) => Object.assign({}, state, {name: payload}),
    },
    // 异步数据变更
    effects: {
        getDataAsync() {
             fetch('/get').then((res) => {
                 return res.json();
             }).then((data) => {
                 this.changeName(data.name);
             }).catch(err => {
                 reject(err);
             })
        }
    }
};

// 创建可共享 state 的 hooks
export default createShareStateHook(count)
```


### 使用共享 hooks

```jsx
import useCounter from './useCounter';

const Controls = () => {
  const [data, dispatch, effects] = useCounter();
  return (
    <>
      <div>当前 count: {data.count} </div>
      <button onClick={() => dispatch.increment(1)}>加一</button>
      <button onClick={() => dispatch.decrement(1)}>减一</button>
      <button onClick={() => effects.getDataAsync()}>获取异步数据</button>
    </>
  );
}

const Message = () => {
  const [data] = useCounter();
  const {count, name} = data;
  return (
    <div>
      <div>count: {count}</div>
      <div>name: {name}</div>
    </div>
  )
}
```