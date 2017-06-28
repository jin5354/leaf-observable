/*
 * @Filename: watcher.js
 * @Author: jin5354
 * @Email: xiaoyanjinx@gmail.com
 * @Last Modified time: 2017-06-28 08:22:40
 */
import isEqual from 'lodash.isequal'
import cloneDeep from 'lodash.clonedeep'
import {queueWatcher} from './scheduler.js'
import {Dep} from './dep.js'
import {isObject} from './util.js'

let uid = 1

export class Watcher {

  constructor(expFn, cb, options = {}) {
    this.uid = uid++
    this.context = options.context
    this.immediate = options.immediate
    this.deep = options.deep
    this.expFn = expFn
    this.depIds = new Set()
    this.pathPointCollect = []
    this.depTarget = []
    this.collectingPathPoint = false
    this.cb = cb
    this.value = this.subAndGetValue()
    this.clonedOldValue = cloneDeep(this.value)
  }

  /**
   * [update 更新，根据 immediate 参数判断是否立刻执行回调]
   */
  update() {
    if(this.immediate) {
      this.run()
    }else {
      queueWatcher(this)
    }
  }

  /**
   * [run 执行回调]
   */
  run() {
    let value = this.subAndGetValue()
    if(!isEqual(value, this.clonedOldValue)) {
      this.value = value
      this.cb.call(this.context, value, this.clonedOldValue)
      this.clonedOldValue = cloneDeep(value)
    }
  }

  /**
   * [subAndGetValue 依赖收集]
   * @return {[any]}
   */
  subAndGetValue() {
    Dep.target = this
    if(this.deep) {
      this.collectingPathPoint = true
    }
    let value = this.expFn.call(this.context)
    if(this.deep) {
      this.collectingPathPoint = false
      this.extraction()
      this.depTarget.forEach(value => {
        traverse(value)
      })
      this.cleanDeepCollectInfo()
    }
    Dep.target = null
    return value
  }

  /**
   * [addDep 通知 Dep 添加订阅]
   */
  addDep(dep) {
    if(!this.depIds.has(dep.id)) {
      this.depIds.add(dep.id)
      dep.addSub(this)
    }
  }

  /**
   * [addDeepCollect 仅在 deep watch 时用到，收集 getter 路径点，分析得到所有依赖]
   * @param {[type]} pathPoint [description]
   */
  addAndExtractionDeepCollect(pathPoint) {
    if(pathPoint.isRoot) {
      this.extraction()
    }
    this.pathPointCollect.push(pathPoint)
  }

  /**
   * [extraction 抽出依赖对象]
   */
  extraction() {
    if(this.pathPointCollect.length !== 0) {
      if(isObject(this.pathPointCollect[this.pathPointCollect.length - 1].value)) {
        this.depTarget.push(this.pathPointCollect[this.pathPointCollect.length - 1].value)
      }
      this.pathPointCollect.length = 0
    }
  }

  cleanDeepCollectInfo() {
    this.pathPointCollect.length = 0
    this.depTarget.length = 0
  }

}

/**
 * 深度优先递归遍历 object，触发每一个子属性的 getter
 */
const seenObjects = new Set()
function traverse(val) {
  seenObjects.clear()
  _traverse(val, seenObjects)
}

function _traverse(val, seen) {
  let i, keys
  const isA = Array.isArray(val)
  if ((!isA && !isObject(val)) || !Object.isExtensible(val)) {
    return
  }
  /* istanbul ignore else */
  if (val.__observer__) {
    const depId = val.__observer__.dep.id
    /* istanbul ignore if */
    if (seen.has(depId)) {
      return
    }
    seen.add(depId)
  }
  if (isA) {
    i = val.length
    while(i--) {
      _traverse(val[i], seen)
    }
  } else {
    keys = Object.keys(val)
    i = keys.length
    while(i--) {
      _traverse(val[keys[i]], seen)
    }
  }
}

export function watch(expFn, cb, options) {
  return new Watcher(expFn, cb, options)
}
