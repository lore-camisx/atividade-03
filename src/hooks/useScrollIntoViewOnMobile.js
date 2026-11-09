import { useEffect, useRef } from 'react'

// No celular as páginas ficam empilhadas: ao escolher algo, rola até a página da direita.
export function useScrollIntoViewOnMobile(trigger) {
  const ref = useRef(null)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (trigger && window.matchMedia('(max-width: 900px)').matches) {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [trigger])

  return ref
}
