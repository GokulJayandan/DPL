import { useEffect, useRef } from 'react'
import './CricketCursor.css'

const TRAIL_PARTICLE_COUNT = 18
const RIPPLE_COUNT = 4
const INTERACTIVE_SELECTOR = [
  'a[href]',
  'button',
  'input',
  'select',
  'textarea',
  'summary',
  '[role=button]',
  '[contenteditable=true]',
  '[data-cursor-interactive]',
].join(',')

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

export default function CricketCursor() {
  const ballRef = useRef(null)
  const particleRefs = useRef([])
  const rippleRefs = useRef([])

  useEffect(() => {
    const finePointerQuery = window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)')
    const touchPointerQuery = window.matchMedia('(hover: none) and (pointer: coarse)')
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const cursor = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      rotation: 0,
      targetRotation: 0,
      scale: 1,
      visible: false,
      initialized: false,
      hovered: false,
      pressed: false,
      touchMode: false,
      hideAt: 0,
    }
    const particles = Array(TRAIL_PARTICLE_COUNT).fill(null)
    const ripples = Array(RIPPLE_COUNT).fill(null)
    let particleIndex = 0
    let rippleIndex = 0
    let animationFrame = 0
    let enabled = false
    let reducedMotion = reducedMotionQuery.matches
    let lastTrailX = 0
    let lastTrailY = 0
    let lastTrailTime = 0

    const hideCursor = () => {
      cursor.visible = false
      if (ballRef.current) ballRef.current.style.opacity = '0'
    }

    const updateEligibility = () => {
      enabled = finePointerQuery.matches || touchPointerQuery.matches
      reducedMotion = reducedMotionQuery.matches
      document.documentElement.classList.toggle('cricket-cursor-enabled', finePointerQuery.matches)
      if (!enabled) hideCursor()
    }

    const spawnParticle = (x, y, movementX, movementY, now) => {
      if (reducedMotion) return
      const distance = Math.hypot(x - lastTrailX, y - lastTrailY)
      const minimumDistance = 9
      const minimumDelay = 42
      if (distance < minimumDistance && now - lastTrailTime < minimumDelay) return

      particles[particleIndex] = {
        x: x + (Math.random() - 0.5) * 5,
        y: y + (Math.random() - 0.5) * 5,
        vx: -movementX * 0.12 + (Math.random() - 0.5) * 0.8,
        vy: -movementY * 0.12 + (Math.random() - 0.5) * 0.8,
        born: now,
        life: 400 + Math.random() * 200,
        size: 7 + Math.random() * 5,
      }
      particleIndex = (particleIndex + 1) % TRAIL_PARTICLE_COUNT
      lastTrailX = x
      lastTrailY = y
      lastTrailTime = now
    }

    const spawnRipple = () => {
      if (reducedMotion) return
      ripples[rippleIndex] = {
        x: cursor.targetX,
        y: cursor.targetY,
        born: performance.now(),
        life: 420,
      }
      rippleIndex = (rippleIndex + 1) % RIPPLE_COUNT
    }

    const updateCursorPosition = (clientX, clientY, target, touchMode) => {
      if (!enabled) return

      const movementX = clientX - cursor.targetX
      const movementY = clientY - cursor.targetY
      cursor.targetX = clientX
      cursor.targetY = clientY
      cursor.visible = true
      cursor.touchMode = touchMode
      cursor.hideAt = 0

      if (!cursor.initialized) {
        cursor.x = clientX
        cursor.y = clientY
        cursor.initialized = true
      }

      if (!reducedMotion) {
        cursor.targetRotation += clamp(movementX * 0.8 + movementY * 0.25, -22, 22)
      }

      cursor.hovered = target instanceof Element && Boolean(target.closest(INTERACTIVE_SELECTOR))
      spawnParticle(clientX, clientY, movementX, movementY, performance.now())
      if (ballRef.current) ballRef.current.style.opacity = '1'
    }

    const handlePointerMove = (event) => {
      if (event.pointerType === 'touch') return
      updateCursorPosition(event.clientX, event.clientY, event.target, false)
    }

    const handlePointerDown = (event) => {
      if (!enabled || event.pointerType === 'touch') return
      cursor.pressed = true
      spawnRipple()
    }

    const handlePointerUp = (event) => {
      if (event.pointerType === 'touch') return
      cursor.pressed = false
    }

    const handleTouchStart = (event) => {
      if (!enabled || !event.touches.length) return
      const touch = event.touches[0]
      cursor.pressed = true
      updateCursorPosition(touch.clientX, touch.clientY, document.elementFromPoint(touch.clientX, touch.clientY), true)
      spawnRipple()
    }

    const handleTouchMove = (event) => {
      if (!enabled || !event.touches.length) return
      const touch = event.touches[0]
      cursor.pressed = true
      updateCursorPosition(touch.clientX, touch.clientY, document.elementFromPoint(touch.clientX, touch.clientY), true)
    }

    const handleTouchEnd = (event) => {
      if (event.touches.length) {
        const touch = event.touches[0]
        updateCursorPosition(touch.clientX, touch.clientY, document.elementFromPoint(touch.clientX, touch.clientY), true)
        return
      }
      cursor.pressed = false
      cursor.hideAt = performance.now() + 500
    }

    const handleWindowExit = (event) => {
      if (!event.relatedTarget) hideCursor()
    }

    const renderFrame = (now) => {
      if (cursor.hideAt && now >= cursor.hideAt) {
        cursor.hideAt = 0
        hideCursor()
      }
      const easing = reducedMotion ? 1 : 0.34
      cursor.x += (cursor.targetX - cursor.x) * easing
      cursor.y += (cursor.targetY - cursor.y) * easing
      cursor.rotation += ((reducedMotion ? 0 : cursor.targetRotation) - cursor.rotation) * 0.2

      const targetScale = cursor.pressed ? 0.78 : cursor.hovered ? 46 / 38 : 1
      cursor.scale += (targetScale - cursor.scale) * (reducedMotion ? 1 : 0.3)

      if (ballRef.current && cursor.initialized) {
        ballRef.current.style.transform = `translate3d(${cursor.x}px, ${cursor.y}px, 0) translate3d(-50%, -50%, 0) rotate(${cursor.rotation}deg) scale(${cursor.scale})`
        ballRef.current.classList.toggle('is-hovering', cursor.hovered)
      }

      particles.forEach((particle, index) => {
        const element = particleRefs.current[index]
        if (!element || !particle || reducedMotion) {
          if (element) element.style.opacity = '0'
          return
        }

        const progress = (now - particle.born) / particle.life
        if (progress >= 1) {
          particles[index] = null
          element.style.opacity = '0'
          return
        }

        const x = particle.x + particle.vx * progress * 18
        const y = particle.y + particle.vy * progress * 18 + progress * 5
        const scale = 1 - progress
        element.style.width = `${particle.size}px`
        element.style.height = `${particle.size}px`
        element.style.opacity = `${(1 - progress) * 0.95}`
        element.style.transform = `translate3d(${x}px, ${y}px, 0) translate3d(-50%, -50%, 0) scale(${scale})`
      })

      ripples.forEach((ripple, index) => {
        const element = rippleRefs.current[index]
        if (!element || !ripple || reducedMotion) {
          if (element) element.style.opacity = '0'
          return
        }

        const progress = (now - ripple.born) / ripple.life
        if (progress >= 1) {
          ripples[index] = null
          element.style.opacity = '0'
          return
        }

        element.style.opacity = `${1 - progress}`
        element.style.transform = `translate3d(${ripple.x}px, ${ripple.y}px, 0) translate3d(-50%, -50%, 0) scale(${0.35 + progress * 2.15})`
      })

      animationFrame = requestAnimationFrame(renderFrame)
    }

    updateEligibility()
    document.addEventListener('pointermove', handlePointerMove, { passive: true })
    document.addEventListener('pointerdown', handlePointerDown, { passive: true })
    document.addEventListener('pointerup', handlePointerUp, { passive: true })
    document.addEventListener('pointercancel', handlePointerUp, { passive: true })
    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })
    document.addEventListener('touchcancel', handleTouchEnd, { passive: true })
    document.addEventListener('mouseout', handleWindowExit, { passive: true })
    window.addEventListener('blur', hideCursor)
    finePointerQuery.addEventListener('change', updateEligibility)
    touchPointerQuery.addEventListener('change', updateEligibility)
    reducedMotionQuery.addEventListener('change', updateEligibility)
    animationFrame = requestAnimationFrame(renderFrame)

    return () => {
      cancelAnimationFrame(animationFrame)
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('pointerup', handlePointerUp)
      document.removeEventListener('pointercancel', handlePointerUp)
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
      document.removeEventListener('touchcancel', handleTouchEnd)
      document.removeEventListener('mouseout', handleWindowExit)
      window.removeEventListener('blur', hideCursor)
      finePointerQuery.removeEventListener('change', updateEligibility)
      touchPointerQuery.removeEventListener('change', updateEligibility)
      reducedMotionQuery.removeEventListener('change', updateEligibility)
      document.documentElement.classList.remove('cricket-cursor-enabled')
    }
  }, [])

  return (
    <div className='cricket-cursor-layer' aria-hidden='true'>
      {Array.from({ length: TRAIL_PARTICLE_COUNT }, (_, index) => (
        <span
          key={`particle-${index}`}
          ref={(element) => { particleRefs.current[index] = element }}
          className={`cricket-cursor-particle particle-${index % 2 ? 'gold' : 'green'}`}
        />
      ))}
      {Array.from({ length: RIPPLE_COUNT }, (_, index) => (
        <span
          key={`ripple-${index}`}
          ref={(element) => { rippleRefs.current[index] = element }}
          className='cricket-cursor-ripple'
        />
      ))}
      <img
        ref={ballRef}
        className='cricket-cursor-ball'
        src='/assets/cricket-ball-cursor.png'
        alt=''
        draggable='false'
      />
    </div>
  )
}
