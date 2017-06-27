/*
 * @Filename: scheduler.js
 * @Author: jin5354
 * @Email: xiaoyanjinx@gmail.com
 * @Last Modified time: 2017-06-28 07:30:18
 */
import {nextTick} from './nextTick.js'

const queue = []
const watcherIds = {}
let waiting = false

function flushSchedulerQueue() {
  queue.forEach(watcher => {
    watcher.run()
  })
}

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
