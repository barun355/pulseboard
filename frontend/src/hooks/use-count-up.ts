import { useEffect, useState } from "react"

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4)
}

export function useCountUp(target: number, duration = 1000): number {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (target === 0) {
      setValue(0)
      return
    }

    let start: number | null = null
    let rafId: number

    function step(timestamp: number) {
      if (start === null) start = timestamp
      const elapsed = timestamp - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutQuart(progress)

      setValue(Math.round(eased * target))

      if (progress < 1) {
        rafId = requestAnimationFrame(step)
      }
    }

    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  }, [target, duration])

  return value
}
