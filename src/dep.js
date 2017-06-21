/*
 * @Filename: dep.js
 * @Author: jin5354
 * @Email: xiaoyanjinx@gmail.com
 * @Last Modified time: 2017-06-21 11:12:29
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
   * [removeSub 移除订阅]
   * @param  {[watcher]} sub
   */
  removeSub(sub) {
    let index = this.subs.indexOf(sub)
    if(index !== -1) {
      this.subs.splice(index, 1)
    }
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
