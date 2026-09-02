import { useEffect } from 'react'

/**
 * useScrollReveal - Reveals [data-reveal] elements when they enter the viewport.
 *
 * Progressive enhancement approach:
 * 1. Content is visible by default (CSS fallback - no JS needed).
 * 2. When this hook runs, it adds 'reveal-ready' to <html>, which activates
 *    the hidden-until-revealed CSS behavior.
 * 3. It immediately reveals above-the-fold content.
 * 4. IntersectionObserver reveals the rest on scroll.
 * 5. A 400ms hard fallback ensures everything is visible even if observer fails.
 */
export function useScrollReveal() {
  useEffect(() => {
    // Mark HTML as reveal-ready so CSS can hide elements (progressive enhancement)
    document.documentElement.classList.add('reveal-ready')

    const revealAll = () => {
      document.querySelectorAll('[data-reveal]').forEach((el) => {
        el.classList.add('revealed')
      })
    }

    // Use rAF to ensure DOM is fully painted before querying positions
    const raf = requestAnimationFrame(() => {
      const elements = document.querySelectorAll('[data-reveal]')

      // Immediately reveal any element already visible in the viewport
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight + 100) {
          el.classList.add('revealed')
        }
      })

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed')
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
      )

      elements.forEach((el) => {
        if (!el.classList.contains('revealed')) {
          observer.observe(el)
        }
      })

      // Hard safety fallback — reveal everything after 400ms no matter what
      const fallback = setTimeout(revealAll, 400)

      return () => {
        clearTimeout(fallback)
        observer.disconnect()
      }
    })

    return () => {
      cancelAnimationFrame(raf)
      // Remove reveal-ready class on cleanup
      document.documentElement.classList.remove('reveal-ready')
    }
  }, [])
}
