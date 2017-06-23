/*
 * @Filename: watcher.js
 * @Author: jin5354
 * @Email: xiaoyanjinx@gmail.com
 * @Last Modified time: 2017-06-23 08:14:39
 */

import {Dep} from './dep.js'
import isEqual from 'lodash.isequal'
import cloneDeep from 'lodash.clonedeep'

export class Watcher {

  constructor(expFn, cb, context) {
    this.context = context
    this.expFn = expFn
    this.depIds = new Set()
    this.cb = cb
    this.value = this.subAndGetValue()
    this.clonedOldValue = cloneDeep(this.value)
  }

  /**
   * [update 执行回调]
   */
  update() {
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
    let value = this.expFn.call(this.context)
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

}

export function watch(expFn, cb, context) {
  return new Watcher(expFn, cb, context)
}
