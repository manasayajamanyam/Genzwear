export function withServiceTimeout(promise, milliseconds = 2500) {
  let timeoutId
  const timeout = new Promise((_, reject) => {
    timeoutId = window.setTimeout(() => reject(new Error('Service request timed out.')), milliseconds)
  })

  return Promise.race([promise, timeout]).finally(() => window.clearTimeout(timeoutId))
}
