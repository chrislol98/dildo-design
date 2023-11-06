const toString = Object.prototype.toString
export const isPlainObj = (val) => toString.call(val) === '[object Object]'
export const isNormalType = (target) => {
    return isPlainObj(target)
}
export const isFn = (val) => typeof val === 'function'