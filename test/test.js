/*
 * @Filename: test.js
 * @Author: jin5354
 * @Email: xiaoyanjinx@gmail.com
 * @Last Modified time: 2017-06-23 08:53:03
 */

import test from 'ava'
import {observify, watch} from '../src/index.js'

test('basis test 基本测试', t => {

  let e = {
    a: 1,
    b: {
      c: 10
    }
  }

  let newValueToken, newValueToken2
  let oldValueToken, oldValueToken2

  observify(e)
  watch(() => {
    return e.a
  }, (newVal, oldVal) => {
    newValueToken = newVal
    oldValueToken = oldVal
  })
  watch(() => {
    return e.b.c
  }, (newVal, oldVal) => {
    newValueToken2 = newVal
    oldValueToken2 = oldVal
  })

  e.a = 2
  e.b.c = 20

  t.is(newValueToken, 2)
  t.is(oldValueToken, 1)
  t.is(newValueToken2, 20)
  t.is(oldValueToken2, 10)
  t.pass()

})

test('basis noChange test 基本无变动测试', t => {

  let e = {
    a: 1
  }

  let changeToken = false

  observify(e)
  watch(() => {
    return e.a
  }, () => {
    changeToken = true
  })

  e.a = 1

  t.falsy(changeToken)
  t.pass()

})

test('array test 数组测试', t => {

  let e = {
    a: [1,2,3,4]
  }

  let newValueToken
  let oldValueToken

  observify(e)
  watch(() => {
    return e.a
  }, (newVal, oldVal) => {
    newValueToken = newVal
    oldValueToken = oldVal
  })

  e.a.push(5, 6)

  t.is(oldValueToken.length, 4)
  t.is(newValueToken.length, 6)
  t.pass()

})

test('nested array test 嵌套数组测试', t => {

  let e = {
    a: 1,
    b: {
      c: 2
    },
    d: [{
      f: 1,
      g: {
        h: [{
          i: [[1,2,3,4]]
        }]
      }
    }],
    e: 999
  }

  let newValueToken
  let oldValueToken

  observify(e)
  watch(() => {
    return e.d[0].g.h[0].i[0]
  }, (newVal, oldVal) => {
    newValueToken = newVal
    oldValueToken = oldVal
  })

  e.d[0].g.h[0].i[0].push(5, 6)

  t.is(oldValueToken.length, 4)
  t.is(newValueToken.length, 6)
  t.pass()

})

test('collect dep 向上依赖收集测试', t => {

  let o = {
    a: {
      b: {
        c: {
          d: {
            e: 1
          }
        }
      }
    }
  }

  let newValueToken
  let oldValueToken

  observify(o)
  watch(() => {
    return o.a.b.c
  }, (newVal, oldVal) => {
    newValueToken = newVal
    oldValueToken = oldVal
  })

  o.a = {
    b: {
      c: {
        d: [1, 2, 3]
      }
    },
    f: {
      g: 1
    }
  }

  t.is(newValueToken.d.length, 3)
  t.is(oldValueToken.d.e, 1)
  t.pass()

})

test('avoid duplicate observify 避免重复 observify', t => {

  let e = {
    a: 1
  }

  let a = observify(e)
  let b = observify(e)

  t.is(a, b)
  t.pass()

})

test('avoid observify null 避免 observify null 与 undefined', t => {

  let e = null
  let e2 = undefined

  let a = observify(e)
  let b = observify(e2)

  t.is(a, undefined)
  t.is(b, undefined)
  t.pass()

})

test('avoid observify null 避免相同复杂值触发 update', t => {

  let e = {
    a: {
      b: [1, 2, 3]
    }
  }

  let changeToken = false

  observify(e)
  watch(() => {
    return e.a.b
  }, () => {
    changeToken = true
  })

  e.a = {
    b: [1, 2, 3]
  }
  e.a.b = [1, 2, 3]

  t.falsy(changeToken)
  t.pass()

})
