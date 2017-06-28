/*
 * @Filename: test.js
 * @Author: jin5354
 * @Email: xiaoyanjinx@gmail.com
 * @Last Modified time: 2017-06-28 08:41:31
 */
import 'regenerator-runtime/runtime'
import test from 'ava'
import {observify, watch, nextTick, set, del} from '../src/index.js'

test('basis test 基本测试', async t => {

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

  await nextTick(() => {
    t.is(newValueToken, 2)
    t.is(oldValueToken, 1)
    t.is(newValueToken2, 20)
    t.is(oldValueToken2, 10)
  })
})

test('basis noChange test 基本无变动测试', async t => {

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

  await nextTick(() => {
    t.falsy(changeToken)
  })

})

test('array test 数组测试', async t => {

  let e = {
    a: [1, 2, 3, 4]
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

  nextTick(() => {
    t.is(oldValueToken.length, 4)
    t.is(newValueToken.length, 6)
  })

})

test('nested array test 嵌套数组测试', async t => {

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

  await nextTick(() => {
    t.is(oldValueToken.length, 4)
    t.is(newValueToken.length, 6)
  })

})

test('collect dep 向上依赖收集测试', async t => {

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

  nextTick(() => {
    t.is(newValueToken.d.length, 3)
    t.is(oldValueToken.d.e, 1)
  })

})

test('avoid duplicate observify 避免重复 observify', t => {

  let e = {
    a: 1
  }

  let a = observify(e)
  let b = observify(e)

  t.is(a, b)

})

test('avoid observify null 避免 observify null 与 undefined', t => {

  let e = null
  let e2 = undefined

  let a = observify(e)
  let b = observify(e2)

  t.is(a, undefined)
  t.is(b, undefined)

})

test('avoid observify null 避免相同复杂值触发 update', async t => {

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

  nextTick(() => {
    t.falsy(changeToken)
  })

})

test('deep watch 对象深度监测', async t => {

  let o = {
    a: {
      b: {
        c: {
          d: {
            e: 1
          },
          f: [1, 2, 3],
          g: null
        }
      }
    }
  }

  let changeToken = false

  observify(o)
  watch(() => {
    return o.a.b + JSON.stringify(o.a.b.c)
  }, () => {
    changeToken = true
  }, {
    deep: true,
    context: o
  })

  o.a.b.c.d.e = 2

  await nextTick(() => {
    t.truthy(changeToken)
  })

})

test('scheduler 异步事件队列', async t => {

  let o = {
    a: 1
  }

  let changeToken = 1

  observify(o)
  watch(() => {
    return o.a
  }, () => {
    changeToken ++
  }, {
    deep: true,
    context: o
  })

  o.a = 2
  o.a = 3
  o.a = 4

  await nextTick(() => {
    t.is(changeToken, 2)
  })

})

test('immediate 立刻执行回调', async t => {

  let o = {
    a: 1
  }

  let changeToken = 1

  observify(o)
  watch(() => {
    return o.a
  }, () => {
    changeToken ++
  }, {
    immediate: true
  })

  o.a = 2
  t.is(changeToken, 2)
})

test('set 添加属性', async t => {

  let o = {
    a: {
      b: 1
    },
    d: [1, 2, 3, 4],
    e: 1
  }

  let changeToken = false
  let changeToken2 = false
  let changeToken3 = false

  observify(o)
  watch(() => {
    return o.a
  }, () => {
    changeToken = true
  })

  watch(() => {
    return o.d
  }, () => {
    changeToken2 = true
  })

  watch(() => {
    return o.e
  }, () => {
    changeToken3 = true
  })

  set(o.a, 'c', 2)
  set(o.d, 4, 5)
  set(o.a.b, 'test', 'something')
  set(o, 'e', 2)

  await nextTick(() => {
    t.truthy(changeToken, true)
    t.truthy(changeToken2, true)
    t.truthy(changeToken3, true)
    t.is(o.d.length, 5)
  })
})

test('remove 删除属性', async t => {

  let o = {
    a: {
      b: 1,
      c: 2
    },
    d: [1, 2, 3, 4]
  }

  let changeToken = false
  let changeToken2 = false

  observify(o)
  watch(() => {
    return o.a
  }, () => {
    changeToken = true
  })

  watch(() => {
    return o.d
  }, () => {
    changeToken2 = true
  })

  del(o.a, 'c')
  del(o.d, 3)
  del(o.a.b, 'test')
  del(o.a, 'd')

  await nextTick(() => {
    t.truthy(changeToken, true)
    t.truthy(changeToken2, true)
    t.is(o.d.length, 3)
  })
})
