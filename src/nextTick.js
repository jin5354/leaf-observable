/*
 * @Filename: nextTick.js
 * @Author: jin5354
 * @Email: xiaoyanjinx@gmail.com
 * @Last Modified time: 2017-06-27 19:02:28
 */

const supportMO = typeof MutationObserver !== 'undefined'

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
