/*
 * @Filename: nextTick.js
 * @Email: xiaoyanjinx@gmail.com
 * @Last Modified time: 2017-06-28 14:46:17
 */

const supportMO = typeof MutationObserver !== 'undefined'

/**
 * [nextTick 在函数推入下一个 tick ]
 * @param  {[func]} task
 * @return {[promise]}
 */
export function nextTick(task) {
  return (() => {
    /* istanbul ignore if */
    if(supportMO) {
      let counter = 1
      const observer = new MutationObserver(task)
      const textNode = document.createTextNode(String(counter))
      observer.observe(textNode, {characterData: true})
      textNode.textContent = 2
    }else {
      return Promise.resolve().then(task)
    }
  })()
}
