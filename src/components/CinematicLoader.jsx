import { useEffect, useState, useRef, useCallback } from 'react'

/**
 * InitialLoader
 * ─────────────────────────────────────────────────────────────────────
 * Pure 01% → 100% Cinematic Initialization Screen.
 *
 * • Zero scroll lock — page scrolling is fully unlocked and available immediately
 * • Independent from landing video (Hero handles the landing video)
 * • Multi-stage non-linear easing progression over ~2.4s
 * • Smooth fade & scale out reveal transition upon reaching 100%
 * • Completely unmounts upon completion
 * ─────────────────────────────────────────────────────────────────────
 */
export default function CinematicLoader() {
  const [percent, setPercent] = useState(1)
  const [phase, setPhase] = useState('loading') // 'loading' | 'revealing' | 'done'
  const animFrameRef = useRef(null)

  const handleFinish = useCallback(() => {
    if (phase === 'done') return
    setPhase('revealing')
    setTimeout(() => {
      setPhase('done')
    }, 650)
  }, [phase])

  useEffect(() => {
    // Scrolling is deliberately NOT locked so user can scroll immediately
    const startTime = performance.now()
    const DURATION = 2400 // ~2.4s smooth initialization

    const updateCounter = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(1, elapsed / DURATION)

      // Cinematic multi-stage easing curve
      let eased
      if (progress < 0.3) {
        eased = (progress / 0.3) * 0.35
      } else if (progress < 0.7) {
        const midT = (progress - 0.3) / 0.4
        eased = 0.35 + Math.pow(midT, 0.9) * 0.42
      } else {
        const endT = (progress - 0.7) / 0.3
        eased = 0.77 + Math.pow(endT, 1.2) * 0.23
      }

      const currentVal = Math.min(100, Math.max(1, Math.round(eased * 100)))
      setPercent(currentVal)

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(updateCounter)
      } else {
        setPercent(100)
        setTimeout(() => {
          handleFinish()
        }, 200)
      }
    }

    animFrameRef.current = requestAnimationFrame(updateCounter)

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [handleFinish])

  if (phase === 'done') return null

  // Dynamic telemetry status ticker
  let statusText = 'INITIALIZING CRICKET ARENA ENGINE...'
  if (percent > 25 && percent <= 55) {
    statusText = 'CALIBRATING BIDDING MATRIX & WAR ROOMS...'
  } else if (percent > 55 && percent <= 85) {
    statusText = 'SYNCING PLAYER ROSTERS & AUCTION ASSETS...'
  } else if (percent > 85 && percent < 100) {
    statusText = 'FINALIZING AUCTION FLOOR STAGE...'
  } else if (percent === 100) {
    statusText = 'ARENA READY // ENTERING DPL AUCTION'
  }

  const formattedNum = percent < 10 ? `0${percent}` : `${percent}`

  return (
    <div
      className={`cinematic-loader-overlay ${phase === 'revealing' ? 'loader-fade-out' : ''}`}
      aria-label={`Loading ${percent}%`}
      aria-live="polite"
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={1}
      aria-valuemax={100}
    >
      {/* Background ambient lighting & grid */}
      <div className="loader-ambient-glow" aria-hidden="true" />
      <div className="loader-grid-lines" aria-hidden="true" />

      {/* Top Bar Branding & Skip Action */}
      <div className="loader-top-row">
        <div className="loader-brand-badge">
          <span className="loader-pulse-dot" />
          <span className="loader-brand-title">DPL // CRICKET AUCTION</span>
        </div>
        <div className="loader-top-actions">
          <span className="loader-edition-tag">OFFICIAL PORTAL // 2026 EDITION</span>
          <button
            type="button"
            className="loader-skip-btn"
            onClick={handleFinish}
            aria-label="Skip Loading Screen"
          >
            SKIP ➔
          </button>
        </div>
      </div>

      {/* Center Percentage Display & Telemetry */}
      <div className="loader-center-hero">
        <div className="loader-counter-wrap">
          <span className="loader-huge-number">{formattedNum}</span>
          <span className="loader-pct-sign">%</span>
        </div>

        <div className="loader-status-container">
          <span className="loader-status-live-dot" />
          <span className="loader-status-msg">{statusText}</span>
        </div>
      </div>

      {/* Bottom Precision Progress Track */}
      <div className="loader-bottom-row">
        <div className="loader-track-bar">
          <div
            className="loader-track-fill"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="loader-footer-meta">
          <span className="loader-meta-item">AUCTION SYSTEM // V2.6</span>
          <span className="loader-meta-item">TRANSMISSION: SECURE</span>
        </div>
      </div>
    </div>
  )
}
