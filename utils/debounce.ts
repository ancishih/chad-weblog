export default function debounce(
  fn: (...args: any[]) => void,
  delay: number = 250,
) {
  let timerId: NodeJS.Timeout
  return function (...args: any[]) {
    if (timerId) clearTimeout(timerId)
    timerId = setTimeout(() => fn(...args), delay)
  }
}
