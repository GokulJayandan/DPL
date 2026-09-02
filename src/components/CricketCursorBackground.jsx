import { useEffect, useRef } from 'react'
import './CricketCursorBackground.css'

const TRAIL_COUNT = 10
const RIPPLE_COUNT = 3
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
const CARD_SELECTOR = [
  '.home-intro-card',
  '.editorial-text-card',
  '.highlight-feature-card',
  '.about-highlights-col',
  '.why-pillar-card',
  '.node-card-body',
  '.cta-parameter-bar',
].join(',')

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

export default function CricketCursorBackground() {
  const backgroundRef = useRef(null)
  const ballRef = useRef(null)
  const particleRefs = useRef([])
  const rippleRefs = useRef([])

  useEffect(() => {
    const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const cursor = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      rotation: 0,
      targetRotation: 0,
      scale: 1,
      initialized: false,
      visible: false,
      hovered: false,
      pressed: false,
    }
    const spotlight = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      targetX: window.innerWidth / 2,
      targetY: window.innerHeight / 2,
      opacity: 0,
      targetOpacity: 0,
    }
    const particles = Array(TRAIL_COUNT).fill(null)
    const ripples = Array(RIPPLE_COUNT).fill(null)
    const card = { element: null, x: 0, y: 0, targetX: 0, targetY: 0 }
    let particleIndex = 0
    let rippleIndex = 0
    let animationFrame = 0
    let enabled = finePointerQuery.matches
    let reducedMotion = reducedMotionQuery.matches
    let lastTrailX = 0
    let lastTrailY = 0
    let lastTrailTime = 0

    const clearActiveCard = () => {
      if (!card.element) return
      card.element.classList.remove('cursor-reactive-card')
      card.element.style.removeProperty('--card-x')
      card.element.style.removeProperty('--card-y')
      card.element = null
    }

    const hidePointerEffects = () => {
      cursor.visible = false
      cursor.pressed = false
      spotlight.targetOpacity = 0
      if (ballRef.current) ballRef.current.style.opacity = '0'
      clearActiveCard()
    }

    const updateCapabilities = () => {
      enabled = finePointerQuery.matches
      reducedMotion = reducedMotionQuery.matches
      document.documentElement.classList.toggle('cricket-cursor-enabled', enabled)
      if (!enabled) {
        hidePointerEffects()
        cancelAnimationFrame(animationFrame)
        animationFrame = 0
      } else if (!animationFrame) {
        animationFrame = requestAnimationFrame(renderFrame)
      }
    }

    const updateActiveCard = (target, clientX, clientY) => {
      const nextCard = target instanceof Element ? target.closest(CARD_SELECTOR) : null
      if (nextCard !== card.element) {
        clearActiveCard()
        card.element = nextCard
        if (card.element) {
          card.element.classList.add('cursor-reactive-card')
          card.x = 0
          card.y = 0
        }
      }

      if (!card.element) return
      const rect = card.element.getBoundingClientRect()
      card.targetX = clientX - rect.left
      card.targetY = clientY - rect.top
      if (!card.x && !card.y) {
        card.x = card.targetX
        card.y = card.targetY
      }
    }

    const spawnParticle = (x, y, movementX, movementY, now) => {
      if (reducedMotion) return
      const distance = Math.hypot(x - lastTrailX, y - lastTrailY)
      if (distance < 10 && now - lastTrailTime < 46) return

      const spark = Math.random() < 0.09
      particles[particleIndex] = {
        x: x + (Math.random() - 0.5) * 3,
        y: y + (Math.random() - 0.5) * 3,
        vx: -movementX * 0.08 + (Math.random() - 0.5) * 0.5,
        vy: -movementY * 0.08 + (Math.random() - 0.5) * 0.5,
        born: now,
        life: 380 + Math.random() * 160,
        size: spark ? 2 : 3 + Math.random() * 2,
      }
      particleRefs.current[particleIndex]?.classList.toggle('particle-spark', spark)
      particleIndex = (particleIndex + 1) % TRAIL_COUNT
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
        life: 380,
      }
      rippleIndex = (rippleIndex + 1) % RIPPLE_COUNT
    }

    const handlePointerMove = (event) => {
      if (!enabled || event.pointerType === 'touch') return
      const movementX = event.clientX - cursor.targetX
      const movementY = event.clientY - cursor.targetY
      cursor.targetX = event.clientX
      cursor.targetY = event.clientY
      cursor.visible = true
      spotlight.targetX = event.clientX
      spotlight.targetY = event.clientY
      spotlight.targetOpacity = reducedMotion ? 0 : 1

      if (!cursor.initialized) {
        cursor.x = event.clientX
        cursor.y = event.clientY
        cursor.initialized = true
      }

      if (!reducedMotion) {
        cursor.targetRotation += clamp(movementX * 0.55 + movementY * 0.18, -12, 12)
      }

      cursor.hovered = event.target instanceof Element && Boolean(event.target.closest(INTERACTIVE_SELECTOR))
      updateActiveCard(event.target, event.clientX, event.clientY)
      spawnParticle(event.clientX, event.clientY, movementX, movementY, performance.now())
      if (ballRef.current) ballRef.current.style.opacity = '1'
    }

    const handlePointerDown = (event) => {
      if (!enabled || event.pointerType === 'touch') return
      cursor.pressed = true
      spawnRipple()
    }

    const handlePointerUp = () => {
      cursor.pressed = false
    }

    const handleWindowExit = (event) => {
      if (!event.relatedTarget) hidePointerEffects()
    }

    const renderFrame = (now) => {
      const cursorEase = reducedMotion ? 1 : 0.55
      cursor.x += (cursor.targetX - cursor.x) * cursorEase
      cursor.y += (cursor.targetY - cursor.y) * cursorEase
      cursor.rotation += ((reducedMotion ? 0 : cursor.targetRotation) - cursor.rotation) * 0.18
      const targetScale = cursor.pressed ? 0.9 : cursor.hovered ? 46 / 38 : 1
      cursor.scale += (targetScale - cursor.scale) * (reducedMotion ? 1 : 0.32)

      if (ballRef.current && cursor.initialized) {
        ballRef.current.style.transform = `translate3d(${cursor.x}px, ${cursor.y}px, 0) translate3d(-50%, -50%, 0) rotate(${cursor.rotation}deg) scale(${cursor.scale})`
        ballRef.current.classList.toggle('is-hovering', cursor.hovered)
      }

      spotlight.x += (spotlight.targetX - spotlight.x) * 0.14
      spotlight.y += (spotlight.targetY - spotlight.y) * 0.14
      spotlight.opacity += (spotlight.targetOpacity - spotlight.opacity) * 0.12
      if (backgroundRef.current) {
        backgroundRef.current.style.setProperty('--mouse-x', `${spotlight.x}px`)
        backgroundRef.current.style.setProperty('--mouse-y', `${spotlight.y}px`)
        backgroundRef.current.style.setProperty('--spotlight-opacity', spotlight.opacity.toFixed(3))
      }

      if (card.element && !reducedMotion) {
        card.x += (card.targetX - card.x) * 0.24
        card.y += (card.targetY - card.y) * 0.24
        card.element.style.setProperty('--card-x', `${card.x}px`)
        card.element.style.setProperty('--card-y', `${card.y}px`)
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
        const x = particle.x + particle.vx * progress * 16
        const y = particle.y + particle.vy * progress * 16
        const scale = (particle.size / 4) * (1 - progress)
        element.style.opacity = `${(1 - progress) * 0.72}`
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
        element.style.opacity = `${(1 - progress) * 0.72}`
        element.style.transform = `translate3d(${ripple.x}px, ${ripple.y}px, 0) translate3d(-50%, -50%, 0) scale(${0.4 + progress * 2})`
      })

      animationFrame = enabled ? requestAnimationFrame(renderFrame) : 0
    }

    updateCapabilities()
    document.addEventListener('pointermove', handlePointerMove, { passive: true })
    document.addEventListener('pointerdown', handlePointerDown, { passive: true })
    document.addEventListener('pointerup', handlePointerUp, { passive: true })
    document.addEventListener('pointercancel', handlePointerUp, { passive: true })
    document.addEventListener('mouseout', handleWindowExit, { passive: true })
    window.addEventListener('blur', hidePointerEffects)
    finePointerQuery.addEventListener('change', updateCapabilities)
    reducedMotionQuery.addEventListener('change', updateCapabilities)
    return () => {
      cancelAnimationFrame(animationFrame)
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('pointerup', handlePointerUp)
      document.removeEventListener('pointercancel', handlePointerUp)
      document.removeEventListener('mouseout', handleWindowExit)
      window.removeEventListener('blur', hidePointerEffects)
      finePointerQuery.removeEventListener('change', updateCapabilities)
      reducedMotionQuery.removeEventListener('change', updateCapabilities)
      document.documentElement.classList.remove('cricket-cursor-enabled')
      clearActiveCard()
    }
  }, [])

  return (
    <>
      <div ref={backgroundRef} className='cricket-arena-background' aria-hidden='true'>
        <div className='arena-technical-grid' />
        <div className='arena-field-markings' />
      </div>
      <div className='cricket-cursor-layer' aria-hidden='true'>
        {Array.from({ length: TRAIL_COUNT }, (_, index) => (
          <span
            key={`particle-${index}`}
            ref={(element) => { particleRefs.current[index] = element }}
            className={`cricket-cursor-particle particle-${index % 2 ? 'cyan' : 'blue'}`}
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
    </>
  )
}
