/*
 * @Filename: observable.js
 * @Email: xiaoyanjinx@gmail.com
 * @Last Modified time: 2017-08-21 14:53:12
 */

import {Dep} from './dep.js'
import {isObject} from './util.js'

export class Observable {

  /* istanbul ignore next */
  constructor(value, isRoot = true) {
    this.value = value
    this.dep = new Dep()
    this.isRoot = isRoot
    Object.defineProperty(value, '__observer__', {
      value: this,
      enumerable: false,
      writable: true,
      configurable: true
    })

    if(Array.isArray(value)) {
      this.observifyArray(value)
    }

    Object.keys(value).forEach((key) => {
      defineReactive(value, key, value[key])
    })
  }

  /**
   * [observifyArray 使数组响应化]
   * @param  {[array]} arr
   */
  observifyArray(arr) {
    const aryMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']
    let arrayAugmentations = Object.create(Array.prototype)
    aryMethods.forEach(method => {
      arrayAugmentations[method] = function(...arg) {
        const ob = this.__observer__
        Array.prototype[method].apply(this, arg)
        this.forEach(e => {
          observify(e, false)
        })
        ob.dep.notify()
      }
    })

    Object.setPrototypeOf(arr, arrayAugmentations)
  }

}

/**
 * [observify 将指定对象响应化]
 * @param {[obj]} obj
 * @param {[boolean]} isRoot
 */
export function observify(obj, isRoot = true) {
  if(!isObject(obj)) {
    return
  }
  let ob
  if(obj.__observer__) {
    ob = obj.__observer__
  }else {
    ob = new Observable(obj, isRoot)
  }
  return ob
}

/**
 * [dependArray 在 Array 内收集依赖]
 * @param  {[type]} arr [description]
 * @return {[type]}     [description]
 */
function dependArray(arr) {
  for(let e, i = 0, l = arr.length; i < l; i++) {
    e = arr[i]
    e && e.__observer__ && e.__observer__.dep.depend()
    if (Array.isArray(e)) {
      dependArray(e)
    }
  }
}

/**
 * [defineReactive 将对象的某个 key 响应化]
 * @param  {[obj]} obj
 * @param  {[string]} key
 * @param  {[any]} value
 */
function defineReactive(obj, key, value) {

  let dep = new Dep()

  let ob = observify(value, false)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      if(Dep.target) {
        Dep.target.collectingPathPoint && Dep.target.addAndExtractionDeepCollect({
          key: key,
          value: value,
          isRoot: obj.__observer__.isRoot
        })
        dep.depend()
        if(ob) {
          ob.dep.depend()
        }
        if(Array.isArray(value)) {
          dependArray(value)
        }
      }
      return value
    },
    set: (newValue) => {
      if(newValue === value) {
        return
      }else {
        value = newValue
        ob = observify(newValue, false)
        dep.notify()
      }
    }
  })
}

/**
 * [set 添加属性]
 * @param {[obj]} target
 * @param {[string]} key
 * @param {[any]} val
 */
export function set(target, key, val) {
  if(!isObject(target)) {
    return
  }
  if(Array.isArray(target) && typeof key === 'number') {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }
  if(target.hasOwnProperty(key)) {
    target[key] = val
    return val
  }else {
    const ob = target.__observer__
    /* istanbul ignore else */
    if(ob) {
      defineReactive(ob.value, key, val)
      ob.dep.notify()
    }
  }
  return val
}

/**
 * [remove 删除属性]
 * @param {[obj]} target
 * @param {[string]} key
 * @param {[any]} val
 */
export function del(target, key) {
  if(!isObject(target)) {
    return
  }
  if(Array.isArray(target) && typeof key === 'number') {
    target.splice(key, 1)
    return
  }
  if(!target.hasOwnProperty(key)) {
    return
  }
  const ob = target.__observer__
  delete target[key]
  /* istanbul ignore else */
  if(ob) {
    ob.dep.notify()
  }
  return
}
