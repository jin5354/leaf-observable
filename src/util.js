/*
 * @Filename: util.js
 * @Author: jin
 * @Email: xiaoyanjinx@gmail.com
 * @Last Modified time: 2017-06-21 11:38:03
 */

/**
 * [isObject 判断是否为对象]
 * @param  {[any]}  value   [检查项]
 * @return {Boolean}        [结果]
 */
export function isObject(value) {
  return typeof value === 'object' && value !== null
}
