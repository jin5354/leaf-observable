/*
 * @Filename: test.js
 * @Author: jin5354
 * @Email: xiaoyanjinx@gmail.com
 * @Last Modified time: 2017-06-21 19:05:55
 */

import test from 'ava'
import {observify} from '../src/observable.js'
import {Watcher} from '../src/watcher.js'

test('basis test', t => {

  let e = {
    a: 1
  }

  let newValueToken
  let oldValueToken

  observify(e)
  new Watcher(() => {
    return e.a
  }, (newVal, oldVal) => {
    newValueToken = newVal
    oldValueToken = oldVal
  })

  e.a = 2

  t.is(newValueToken, 2)
  t.is(oldValueToken, 1)
  t.pass()

})
