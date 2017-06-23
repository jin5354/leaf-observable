/*
 * @Filename: dep.js
 * @Author: jin5354
 * @Email: xiaoyanjinx@gmail.com
 * @Last Modified time: 2017-06-23 08:11:07
 */
let uid = 1

export class Dep {

  constructor() {
    this.id = uid++
    this.subs = []
  }

  /**
   * [addSub 添加订阅]
   * @param {[watcher]} sub
   */
  addSub(sub) {
    this.subs.push(sub)
  }

  /**
   * [depend 依赖收集]
   */
  depend() {
    Dep.target && Dep.target.addDep(this)
  }

  /**
   * [notify 触发更新]
   */
  notify() {
    this.subs.forEach(sub => {
      sub.update()
    })
  }

}

Dep.target = null
