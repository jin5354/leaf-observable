/*
 * @Filename: scheduler.js
 * @Email: xiaoyanjinx@gmail.com
 * @Last Modified time: 2017-06-28 15:02:35
 */
import {nextTick} from './nextTick.js'

const queue = []
let watcherIds = {}
let waiting = false

/**
 * [flushSchedulerQueue 遍历执行 queue 中的任务]
 */
function flushSchedulerQueue() {
  queue.forEach(watcher => {
    watcher.run()
  })
  resetSchedulerState()
}

/**
 * [resetSchedulerState 重置 scheduler 状态]
 */
function resetSchedulerState() {
  watcherIds = {}
  waiting = false
}

/**
 * [queueWatcher 将 watcher 推入 queue]
 * @param  {[watcher]} watcher
 */
export function queueWatcher(watcher) {
  const uid = watcher.uid

  if(!watcherIds[uid]) {
    watcherIds[uid] = true
    queue.push(watcher)
    if (!waiting) {
      waiting = true
      nextTick(flushSchedulerQueue)
    }
  }
}
