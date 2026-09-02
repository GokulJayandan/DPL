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
      enabled = true
      reducedMotion = reducedMotionQuery.matches
      document.documentElement.classList.toggle('cricket-cursor-enabled', finePointerQuery.matches)
    }

    let lastTouchTime = 0

    const spawnParticle = (x, y, movementX, movementY, now) => {
      if (reducedMotion) return
      const distance = Math.hypot(x - lastTrailX, y - lastTrailY)
      const minimumDistance = cursor.touchMode ? 5 : 8
      const minimumDelay = cursor.touchMode ? 16 : 30
      if (distance < minimumDistance && now - lastTrailTime < minimumDelay) return

      particles[particleIndex] = {
        x: x + (Math.random() - 0.5) * 4,
        y: y + (Math.random() - 0.5) * 4,
        vx: -movementX * 0.22 + (Math.random() - 0.5) * 0.5,
        vy: -movementY * 0.22 + (Math.random() - 0.5) * 0.5,
        born: now,
        life: cursor.touchMode ? 320 + Math.random() * 140 : 400 + Math.random() * 180,
        size: cursor.touchMode ? 6 + Math.random() * 3 : 7 + Math.random() * 5,
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

      cursor.hovered = !touchMode && target instanceof Element && Boolean(target.closest(INTERACTIVE_SELECTOR))
      if (ballRef.current) ballRef.current.style.opacity = '1'
    }

    const handlePointerMove = (event) => {
      // Ignore touch-based or simulated mouse events fired after mobile touches
      if (event.pointerType === 'touch' || performance.now() - lastTouchTime < 1000) return
      updateCursorPosition(event.clientX, event.clientY, event.target, false)
    }

    const handlePointerDown = (event) => {
      if (!enabled || event.pointerType === 'touch' || performance.now() - lastTouchTime < 1000) return
      cursor.pressed = true
      spawnRipple()
    }

    const handlePointerUp = (event) => {
      if (event.pointerType === 'touch') return
      cursor.pressed = false
    }

    const handleTouchStart = (event) => {
      if (!event.touches.length) return
      lastTouchTime = performance.now()
      const touch = event.touches[0]
      cursor.pressed = true
      cursor.touchMode = true
      cursor.visible = true
      cursor.initialized = true
      cursor.hideAt = 0
      cursor.x = touch.clientX
      cursor.y = touch.clientY
      cursor.targetX = touch.clientX
      cursor.targetY = touch.clientY
      lastTrailX = touch.clientX
      lastTrailY = touch.clientY
      lastTrailTime = performance.now()
      if (ballRef.current) ballRef.current.style.opacity = '1'
      spawnRipple()
    }

    const handleTouchMove = (event) => {
      if (!event.touches.length) return
      lastTouchTime = performance.now()
      const touch = event.touches[0]
      cursor.pressed = true
      cursor.touchMode = true
      cursor.visible = true
      cursor.hideAt = 0
      updateCursorPosition(touch.clientX, touch.clientY, event.target, true)
    }

    const handleTouchEnd = (event) => {
      lastTouchTime = performance.now()
      if (event.touches.length) {
        const touch = event.touches[0]
        updateCursorPosition(touch.clientX, touch.clientY, event.target, true)
        return
      }
      cursor.pressed = false
      cursor.hideAt = performance.now() + 260
    }

    const handleTouchCancel = () => {
      cursor.pressed = false
      cursor.hideAt = performance.now() + 260
    }

    const handleWindowExit = (event) => {
      if (!event.relatedTarget) hideCursor()
    }

    const renderFrame = (now) => {
      if (cursor.hideAt) {
        const remaining = cursor.hideAt - now
        if (remaining <= 0) {
          cursor.hideAt = 0
          hideCursor()
        } else if (ballRef.current && cursor.touchMode) {
          ballRef.current.style.opacity = `${Math.max(0, remaining / 260)}`
        }
      }

      const prevX = cursor.x
      const prevY = cursor.y

      if (cursor.touchMode) {
        // Mobile: High-precision hand tracking so curves are preserved 1:1 without straight-line corner cutting
        const easing = reducedMotion ? 1 : 0.86
        cursor.x += (cursor.targetX - cursor.x) * easing
        cursor.y += (cursor.targetY - cursor.y) * easing
      } else {
        // Desktop: Luxurious floating cursor lag
        const easing = reducedMotion ? 1 : 0.34
        cursor.x += (cursor.targetX - cursor.x) * easing
        cursor.y += (cursor.targetY - cursor.y) * easing
      }

      const ballMovementX = cursor.x - prevX
      const ballMovementY = cursor.y - prevY

      // Spawn trail particles directly behind the ball's actual motion path for realistic flow
      if (cursor.visible && Math.hypot(ballMovementX, ballMovementY) > 0.4) {
        spawnParticle(cursor.x, cursor.y, ballMovementX, ballMovementY, now)
      }

      cursor.rotation += ((reducedMotion ? 0 : cursor.targetRotation) - cursor.rotation) * 0.2

      const targetScale = cursor.pressed ? 0.82 : cursor.hovered ? 46 / 38 : 1
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
    document.addEventListener('touchcancel', handleTouchCancel, { passive: true })
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
      document.removeEventListener('touchcancel', handleTouchCancel)
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
