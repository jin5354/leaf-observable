/*
 * @Filename: example.js
 * @Author: jin
 * @Email: xiaoyanjinx@gmail.com
 * @Last Modified time: 2017-06-21 18:04:21
 */

import {observify} from '../src/observable.js'
import {Watcher} from '../src/watcher.js'

window.o = {
  a: 1,
  b: {
    c: 2
  },
  d: [1, 2, 3, 4],
  e: 999
}

let o = window.o

observify(o)

new Watcher(() => {
  return o.a
}, (newVal, oldVal) => {
  console.log('newVal:', newVal, ' oldVal:', oldVal)
})

new Watcher(() => {
  return o.e
}, (newVal, oldVal) => {
  console.log('newVal:', newVal, ' oldVal:', oldVal)
})

console.log(o.a = 2)
console.log(o.e = 1000)
