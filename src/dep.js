/*
 * @Filename: dep.js
 * @Email: xiaoyanjinx@gmail.com
 * @Last Modified time: 2017-06-29 08:59:44
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
   * [removeSub 移除订阅]
   * @param  {[watcher]} sub
   */
  removeSub(sub) {
    let index = this.subs.indexOf(sub)
    index !== -1 && this.subs.splice(index, 1)
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
