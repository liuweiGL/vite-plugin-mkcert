type AnyFn = (...args: any[]) => void

export type ThrottledFn<T extends AnyFn> = ((...args: Parameters<T>) => void) & {
  cancel: () => void
  flush: () => void
}

export const throttle = <T extends AnyFn>(
  fn: T,
  wait = 300
): ThrottledFn<T> => {
  let timeout: ReturnType<typeof setTimeout> | undefined
  let lastInvokeTime = 0
  let pendingArgs: Parameters<T> | undefined

  const invoke = (args: Parameters<T>) => {
    lastInvokeTime = Date.now()
    fn(...args)
  }

  const throttled = ((...args: Parameters<T>) => {
    const now = Date.now()
    const elapsed = now - lastInvokeTime
    const remaining = wait - elapsed

    pendingArgs = args

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = undefined
      }

      invoke(args)
      pendingArgs = undefined
      return
    }

    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = undefined

        if (!pendingArgs) {
          return
        }

        invoke(pendingArgs)
        pendingArgs = undefined
      }, remaining)
    }
  }) as ThrottledFn<T>

  throttled.cancel = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = undefined
    }

    pendingArgs = undefined
  }

  throttled.flush = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = undefined
    }

    if (!pendingArgs) {
      return
    }

    invoke(pendingArgs)
    pendingArgs = undefined
  }

  return throttled
}
