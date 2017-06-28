# leaf-observable

[![Build Status](https://travis-ci.org/jin5354/leaf-observable.svg?branch=master)](https://travis-ci.org/jin5354/leaf-observable)
[![Coverage Status](https://coveralls.io/repos/github/jin5354/leaf-observable/badge.svg?branch=master)](https://coveralls.io/github/jin5354/leaf-observable?branch=master)

Observe data & make data Reactive.

## Intro

[现代前端科技解析 —— 数据响应式系统 (Data Reactivity System)](https://www.404forest.com/2017/06/28/modern-web-development-tech-analysis-data-reactivity-system/)

## Install

```bash
npm install leaf-observable --save-dev
```
or
```bash
yarn add leaf-observable --dev
```

## Feature

- 支持数组监测
- 支持自动依赖收集
- 支持异步事件队列
- 支持通过 set/del 添加删除属性
- 支持 deep watch
- 支持 immediate 同步执行回调
- 可以设置 expFn 的 context，允许 'return this.a + this.b' 这种写法

## Usage

```javascript
import {observify, watch, set, del} from 'leaf-observable'

let o = {
  a: 1,
  b: {
    c: [1, 2, 3, 4],
    d: 2,
    e: 3
  }
}

observify(o)

watch(() => {
  return o.a + o.b.e
}, (newVal, oldVal) => {
  console.log('newValue:', newVal, ', oldValue:', oldVal)
})

o.a = 2   // console: newVal: 5  oldVal: 4

```

## API

### observify(obj)

Observify a object.

- obj(object): the object to be observified.

### watch(expFn, callback, options)

Add a new watcher.

- expFn(function): function which return needed value which rely on reactive data.
- callback(function): function to call after expFn's result has been changed.
- options(object):
  - deep(boolean): whether watch nested objects.
  - immediate(boolean): whether run callback function syncly.
  - context(object): the context when expFn runs, will be 'this' in expFn.

### set(obj, key, value)

Dynamic add attribute to a reactive object.

- obj(object): target object
- key(string): key
- value(any): value

### del(obj, key)

Dynamic delete attribute in a reactive object.

- obj(object): target object
- key(string): key

## LICENSE

MIT
