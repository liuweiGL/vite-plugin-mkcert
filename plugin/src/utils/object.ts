const isObj = (obj: any) =>
  Object.prototype.toString.call(obj) === '[object Object]'

const mergeObj = (target: any, source: any) => {
  if (!(isObj(target) && isObj(source))) {
    return target
  }

  for (const key in source) {
    if (Object.hasOwn(source, key)) {
      const targetValue = target[key]
      const sourceValue = source[key]

      if (isObj(targetValue) && isObj(sourceValue)) {
        mergeObj(targetValue, sourceValue)
      } else {
        target[key] = sourceValue
      }
    }
  }
}

export const deepMerge = (target: any, ...source: any[]) => {
  return source.reduce((a, b) => mergeObj(a, b), target)
}
