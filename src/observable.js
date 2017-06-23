/*
 * @Filename: observable.js
 * @Author: jin5354
 * @Email: xiaoyanjinx@gmail.com
 * @Last Modified time: 2017-06-23 08:28:24
 */

import {Dep} from './dep.js'
import {isObject} from './util.js'

export class Observable {

  constructor(value) {
    this.value = value
    this.dep = new Dep()
    Object.defineProperty(value, '__observer__', {
      value: this,
      enumerable: false,
      writable: true,
      configurable: true
    })

    if(Array.isArray(value)) {
      this.observifyArray(value)
      for(let i = 0; i < value.length; i++) {
        observify(value[i])
      }
    }else {
      Object.keys(value).forEach((key) => {
        this.defineReactive(value, key, value[key])
      })
    }
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
        ob.dep.notify()
      }
    })

    Object.setPrototypeOf(arr, arrayAugmentations)
  }

  /**
   * [defineReactive 将对象的某个 key 响应化]
   * @param  {[obj]} obj
   * @param  {[string]} key
   * @param  {[any]} value
   */
  defineReactive(obj, key, value) {

    let dep = new Dep()

    let ob = observify(value)
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        if(Dep.target) {
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
          observify(newValue)
          dep.notify()
        }
      }
    })
  }

}

/**
 * [observify 将指定对象响应化]
 * @param {[obj]} obj
 */
export function observify(obj) {
  if(!isObject(obj)) {
    return
  }
  let ob
  if(obj.__observer__) {
    ob = obj.__observer__
  }else {
    ob = new Observable(obj)
  }
  return ob
}

/**
 * [dependArray 在 Array 内收集依赖]
 * @param  {[type]} arr [description]
 * @return {[type]}     [description]
 */
function dependArray(arr) {
  for (let e, i = 0, l = arr.length; i < l; i++) {
    e = arr[i]
    e && e.__observer__ && e.__observer__.dep.depend()
    if (Array.isArray(e)) {
      dependArray(e)
    }
  }
}
