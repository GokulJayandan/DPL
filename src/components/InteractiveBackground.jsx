import { useEffect, useRef } from 'react'
import './InteractiveBackground.css'

export default function InteractiveBackground() {
  const backgroundRef = useRef(null)

  useEffect(() => {
    const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const position = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      targetX: window.innerWidth / 2,
      targetY: window.innerHeight / 2,
      opacity: 0,
      targetOpacity: 0,
    }
    let animationFrame = 0
    let enabled = finePointerQuery.matches && !reducedMotionQuery.matches

    const renderFrame = () => {
      position.x += (position.targetX - position.x) * 0.14
      position.y += (position.targetY - position.y) * 0.14
      position.opacity += (position.targetOpacity - position.opacity) * 0.12

      if (backgroundRef.current) {
        backgroundRef.current.style.setProperty('--mouse-x', `${position.x}px`)
        backgroundRef.current.style.setProperty('--mouse-y', `${position.y}px`)
        backgroundRef.current.style.setProperty('--gradient-opacity', position.opacity.toFixed(3))
      }

      animationFrame = enabled ? requestAnimationFrame(renderFrame) : 0
    }

    const startAnimation = () => {
      if (!animationFrame && enabled) animationFrame = requestAnimationFrame(renderFrame)
    }

    const updateCapability = () => {
      enabled = finePointerQuery.matches && !reducedMotionQuery.matches
      if (enabled) {
        startAnimation()
      } else {
        cancelAnimationFrame(animationFrame)
        animationFrame = 0
        position.targetOpacity = 0
        if (backgroundRef.current) backgroundRef.current.style.setProperty('--gradient-opacity', '0')
      }
    }

    const handlePointerMove = (event) => {
      if (!enabled || event.pointerType === 'touch') return
      position.targetX = event.clientX
      position.targetY = event.clientY
      position.targetOpacity = 1
      startAnimation()
    }

    const handlePointerLeave = (event) => {
      if (!event.relatedTarget) position.targetOpacity = 0
    }

    updateCapability()
    document.addEventListener('pointermove', handlePointerMove, { passive: true })
    document.addEventListener('mouseout', handlePointerLeave, { passive: true })
    window.addEventListener('blur', handlePointerLeave)
    finePointerQuery.addEventListener('change', updateCapability)
    reducedMotionQuery.addEventListener('change', updateCapability)

    return () => {
      cancelAnimationFrame(animationFrame)
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('mouseout', handlePointerLeave)
      window.removeEventListener('blur', handlePointerLeave)
      finePointerQuery.removeEventListener('change', updateCapability)
      reducedMotionQuery.removeEventListener('change', updateCapability)
    }
  }, [])

  return <div ref={backgroundRef} className='interactive-ui-background' aria-hidden='true' />
}
