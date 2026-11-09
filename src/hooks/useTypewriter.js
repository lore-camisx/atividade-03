import { useEffect, useState } from 'react'

// Revela o texto letra a letra, como nas caixas de diálogo dos jogos.
export function useTypewriter(text, speed = 28) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    setCount(0)
    if (!text) return
    const timer = setInterval(() => {
      setCount((c) => {
        if (c >= text.length) {
          clearInterval(timer)
          return c
        }
        return c + 1
      })
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed])

  const done = count >= (text?.length ?? 0)
  return { shown: text?.slice(0, count) ?? '', done, skip: () => setCount(text?.length ?? 0) }
}
