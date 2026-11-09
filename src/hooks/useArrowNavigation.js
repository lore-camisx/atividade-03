import { useEffect } from 'react'

// Setas ← → trocam de item, menos quando o foco está num campo de texto/seleção.
export function useArrowNavigation(onPrev, onNext, enabled = true) {
  useEffect(() => {
    if (!enabled) return
    function onKeyDown(event) {
      if (event.target.closest('input, select, textarea')) return
      if (event.key === 'ArrowLeft') onPrev()
      if (event.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onPrev, onNext, enabled])
}
