import { useEffect, useRef } from 'react'
import './CricketCursor.css'

const TRAIL_PARTICLE_COUNT = 22
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
    // Buffer of raw coalesced touch points collected between RAF frames
    const touchBuffer = []
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
    let lastPointerTime = 0

    const hideCursor = () => {
      cursor.visible = false
      if (ballRef.current) ballRef.current.style.opacity = '0'
    }

    const updateEligibility = () => {
      enabled = true
      reducedMotion = reducedMotionQuery.matches
      document.documentElement.classList.toggle('cricket-cursor-enabled', finePointerQuery.matches)
    }

    const spawnParticle = (x, y, movementX, movementY, now) => {
      if (reducedMotion) return
      const distance = Math.hypot(x - lastTrailX, y - lastTrailY)
      const minDist = cursor.touchMode ? 4 : 8
      const minDelay = cursor.touchMode ? 12 : 30
      if (distance < minDist && now - lastTrailTime < minDelay) return

      particles[particleIndex] = {
        x: x + (Math.random() - 0.5) * 3,
        y: y + (Math.random() - 0.5) * 3,
        vx: -movementX * 0.18 + (Math.random() - 0.5) * 0.4,
        vy: -movementY * 0.18 + (Math.random() - 0.5) * 0.4,
        born: now,
        life: cursor.touchMode ? 280 + Math.random() * 120 : 400 + Math.random() * 180,
        size: cursor.touchMode ? 5 + Math.random() * 3 : 7 + Math.random() * 5,
      }
      particleIndex = (particleIndex + 1) % TRAIL_PARTICLE_COUNT
      lastTrailX = x
      lastTrailY = y
      lastTrailTime = now
    }

    const spawnRipple = (x, y) => {
      if (reducedMotion) return
      ripples[rippleIndex] = {
        x: x ?? cursor.x,
        y: y ?? cursor.y,
        born: performance.now(),
        life: 400,
      }
      rippleIndex = (rippleIndex + 1) % RIPPLE_COUNT
    }

    // ── POINTER EVENTS ────────────────────────────────────────────────────────

    const handlePointerDown = (event) => {
      if (!enabled) return

      if (event.pointerType === 'touch') {
        lastPointerTime = performance.now()
        cursor.touchMode = true
        cursor.visible = true
        cursor.initialized = true
        cursor.hideAt = 0
        cursor.pressed = true
        // Snap ball directly to first touch point
        cursor.x = event.clientX
        cursor.y = event.clientY
        cursor.targetX = event.clientX
        cursor.targetY = event.clientY
        lastTrailX = event.clientX
        lastTrailY = event.clientY
        lastTrailTime = performance.now()
        if (ballRef.current) ballRef.current.style.opacity = '1'
        spawnRipple(event.clientX, event.clientY)
        return
      }

      // Desktop mouse — ignore post-touch simulated events
      if (performance.now() - lastPointerTime < 800) return
      cursor.pressed = true
      spawnRipple()
    }

    const handlePointerMove = (event) => {
      if (!enabled) return

      if (event.pointerType === 'touch') {
        lastPointerTime = performance.now()
        cursor.touchMode = true
        cursor.visible = true
        cursor.hideAt = 0
        if (ballRef.current) ballRef.current.style.opacity = '1'

        // getCoalescedEvents() returns EVERY raw digitizer sample between frames.
        // This gives us all the points along a curve, not just endpoints.
        // Without this, fast gestures appear as straight line segments.
        const pts = typeof event.getCoalescedEvents === 'function'
          ? event.getCoalescedEvents()
          : [event]

        for (const ce of pts) {
          touchBuffer.push({ x: ce.clientX, y: ce.clientY })
        }
        return
      }

      // Desktop mouse — ignore post-touch simulated events
      if (performance.now() - lastPointerTime < 800) return
      cursor.touchMode = false

      const movementX = event.clientX - cursor.targetX
      const movementY = event.clientY - cursor.targetY
      cursor.targetX = event.clientX
      cursor.targetY = event.clientY
      cursor.visible = true
      cursor.hideAt = 0

      if (!cursor.initialized) {
        cursor.x = event.clientX
        cursor.y = event.clientY
        cursor.initialized = true
      }

      if (!reducedMotion) {
        cursor.targetRotation += clamp(movementX * 0.8 + movementY * 0.25, -22, 22)
      }

      cursor.hovered = event.target instanceof Element && Boolean(event.target.closest(INTERACTIVE_SELECTOR))
      if (ballRef.current) ballRef.current.style.opacity = '1'
    }

    const handlePointerUp = (event) => {
      if (event.pointerType === 'touch') {
        cursor.pressed = false
        cursor.hideAt = performance.now() + 200
        return
      }
      cursor.pressed = false
    }

    const handlePointerCancel = (event) => {
      if (event.pointerType === 'touch') {
        cursor.pressed = false
        cursor.hideAt = performance.now() + 200
      }
    }

    const handleWindowExit = (event) => {
      if (!event.relatedTarget) hideCursor()
    }

    // ── RENDER LOOP ──────────────────────────────────────────────────────────

    const renderFrame = (now) => {
      if (cursor.hideAt) {
        const remaining = cursor.hideAt - now
        if (remaining <= 0) {
          cursor.hideAt = 0
          hideCursor()
        } else if (ballRef.current) {
          ballRef.current.style.opacity = `${Math.max(0, remaining / 200)}`
        }
      }

      if (cursor.touchMode) {
        // MOBILE: consume every coalesced point buffered since the last frame.
        // Direct assignment cursor.x = pt.x means zero interpolation —
        // the ball traces the EXACT same path as every raw digitizer sample.
        if (touchBuffer.length > 0) {
          for (const pt of touchBuffer) {
            const dx = pt.x - cursor.x
            const dy = pt.y - cursor.y
            cursor.x = pt.x
            cursor.y = pt.y
            spawnParticle(pt.x, pt.y, dx, dy, now)
          }
          cursor.targetX = cursor.x
          cursor.targetY = cursor.y

          if (!reducedMotion && touchBuffer.length > 1) {
            const last = touchBuffer[touchBuffer.length - 1]
            const prev = touchBuffer[touchBuffer.length - 2]
            const dx = last.x - prev.x
            const dy = last.y - prev.y
            cursor.targetRotation += clamp(dx * 1.1 + dy * 0.3, -30, 30)
            cursor.rotation = cursor.targetRotation
          }

          touchBuffer.length = 0
        }

        const targetScale = cursor.pressed ? 0.82 : 1
        cursor.scale += (targetScale - cursor.scale) * 0.28

        if (ballRef.current && cursor.initialized) {
          ballRef.current.style.transform = `translate3d(${cursor.x}px, ${cursor.y}px, 0) translate3d(-50%, -50%, 0) rotate(${cursor.rotation}deg) scale(${cursor.scale})`
          // Explicitly keep ball visible during active touch (hideAt block may have set opacity)
          if (!cursor.hideAt) ballRef.current.style.opacity = '1'
        }
      } else {
        // DESKTOP: luxurious floating physics with 0.34 easing
        const prevX = cursor.x
        const prevY = cursor.y

        const easing = reducedMotion ? 1 : 0.34
        cursor.x += (cursor.targetX - cursor.x) * easing
        cursor.y += (cursor.targetY - cursor.y) * easing

        const bMX = cursor.x - prevX
        const bMY = cursor.y - prevY

        if (cursor.visible && Math.hypot(bMX, bMY) > 0.35) {
          spawnParticle(cursor.x, cursor.y, bMX, bMY, now)
        }

        cursor.rotation += ((reducedMotion ? 0 : cursor.targetRotation) - cursor.rotation) * 0.2

        const targetScale = cursor.pressed ? 0.82 : cursor.hovered ? 46 / 38 : 1
        cursor.scale += (targetScale - cursor.scale) * (reducedMotion ? 1 : 0.3)

        if (ballRef.current && cursor.initialized) {
          ballRef.current.style.transform = `translate3d(${cursor.x}px, ${cursor.y}px, 0) translate3d(-50%, -50%, 0) rotate(${cursor.rotation}deg) scale(${cursor.scale})`
          ballRef.current.classList.toggle('is-hovering', cursor.hovered)
        }
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
    // Use pointermove exclusively — it supports getCoalescedEvents() for touch
    document.addEventListener('pointermove', handlePointerMove, { passive: true })
    document.addEventListener('pointerdown', handlePointerDown, { passive: true })
    document.addEventListener('pointerup', handlePointerUp, { passive: true })
    document.addEventListener('pointercancel', handlePointerCancel, { passive: true })
    document.addEventListener('mouseout', handleWindowExit, { passive: true })
    window.addEventListener('blur', hideCursor)
    finePointerQuery.addEventListener('change', updateEligibility)
    reducedMotionQuery.addEventListener('change', updateEligibility)
    animationFrame = requestAnimationFrame(renderFrame)

    return () => {
      cancelAnimationFrame(animationFrame)
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('pointerup', handlePointerUp)
      document.removeEventListener('pointercancel', handlePointerCancel)
      document.removeEventListener('mouseout', handleWindowExit)
      window.removeEventListener('blur', hideCursor)
      finePointerQuery.removeEventListener('change', updateEligibility)
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
