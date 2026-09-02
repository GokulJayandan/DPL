import { useEffect, useState } from 'react'
import { homeIntroCards } from '../data/eventData'
import { ArrowIcon, TrophyIcon, TargetIcon, TeamIcon } from './Icons'
import HeroCollage from './HeroCollage'

const introIcons = [TrophyIcon, TargetIcon, TeamIcon]

/**
 * Hero Component — Final Cinematic Landing Intro (~4.5–5s total):
 * 1. Video starts & continues playing without interruption
 * 2. Stage 1: "DPL AUCTION." (Solid pure white) appears first, holds, then fades out
 * 3. Stage 2: "BUILD YOUR SQUAD. OWN THE GAME." appears, holds, then fades out
 * 4. Stage 3: "WHERE STRATEGY MEETS THE GAME." appears, holds, then fades out
 * 5. Settled: Normal landing hero content appears and stays permanent
 * 6. Scrolling is fully unlocked from the very first millisecond
 */
export default function Hero() {
  // 'title-in' | 'title-out' | 'phrase1-in' | 'phrase1-out' | 'phrase2-in' | 'phrase2-out' | 'settled'
  const [stage, setStage] = useState('title-in')

  useEffect(() => {
    // Cinematic Sequence Timing:
    // • "DPL AUCTION." visible for ~5.8s (range 5–7s)
    // • "BUILD YOUR SQUAD. OWN THE GAME." visible for ~5.8s (range 5–7s)
    // • "WHERE STRATEGY MEETS THE GAME." visible for ~3.5s (range 3–4s)

    // 0.0s – 5.8s: "DPL AUCTION." holds
    const t1 = setTimeout(() => setStage('title-out'), 5800)
    // 5.8s – 6.4s: title fades out, phrase 1 enters
    const t2 = setTimeout(() => setStage('phrase1-in'), 6400)
    // 6.4s – 12.2s: "BUILD YOUR SQUAD. OWN THE GAME." holds (~5.8s)
    const t3 = setTimeout(() => setStage('phrase1-out'), 12200)
    // 12.2s – 12.8s: phrase 1 fades out, phrase 2 enters
    const t4 = setTimeout(() => setStage('phrase2-in'), 12800)
    // 12.8s – 16.3s: "WHERE STRATEGY MEETS THE GAME." holds (~3.5s)
    const t5 = setTimeout(() => setStage('phrase2-out'), 16300)
    // 16.3s – 17.0s: phrase 2 fades out, normal hero content settles in
    const t6 = setTimeout(() => setStage('settled'), 17000)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
      clearTimeout(t6)
    }
  }, [])

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToRegister = () => {
    document.getElementById('registration-action')?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }

  const isIntroActive = stage !== 'settled'

  return (
    <section id="home" className="hero-section section-grid">
      {/* Scrolling image collage background */}
      <HeroCollage />

      {/* 
        ========================================================================
        CINEMATIC INTRO SEQUENCE OVERLAYS (STAGES 1, 2 & 3)
        ========================================================================
      */}

      {/* Stage 1: DPL AUCTION. in Solid Pure White */}
      {(stage === 'title-in' || stage === 'title-out') && (
        <div
          className={`hero-cinematic-stage ${
            stage === 'title-in' ? 'stage-visible' : 'stage-fade-out'
          }`}
          aria-hidden={stage === 'title-out'}
        >
          <div className="hero-intro-kicker">OFFICIAL CRICKET EVENT PORTAL</div>
          <h1 className="hero-title-massive intro-title-white">
            <span className="hero-title-line">DPL</span>
            <span className="hero-title-line">AUCTION.</span>
          </h1>
        </div>
      )}

      {/* Stage 2: First Catchy Phrase — BUILD YOUR SQUAD. OWN THE GAME. */}
      {(stage === 'phrase1-in' || stage === 'phrase1-out') && (
        <div
          className={`hero-cinematic-stage ${
            stage === 'phrase1-in' ? 'stage-visible' : 'stage-fade-out'
          }`}
          aria-hidden={stage === 'phrase1-out'}
        >
          <div className="hero-intro-kicker">THE 2026 AUCTION FLOOR</div>
          <h2 className="hero-catchy-line">
            BUILD YOUR SQUAD.<br />
            OWN THE GAME.
          </h2>
        </div>
      )}

      {/* Stage 3: Second Catchy Phrase — WHERE STRATEGY MEETS THE GAME. */}
      {(stage === 'phrase2-in' || stage === 'phrase2-out') && (
        <div
          className={`hero-cinematic-stage ${
            stage === 'phrase2-in' ? 'stage-visible' : 'stage-fade-out'
          }`}
          aria-hidden={stage === 'phrase2-out'}
        >
          <div className="hero-intro-kicker">STRATEGY &amp; WAR ROOMS</div>
          <h2 className="hero-catchy-line">
            WHERE STRATEGY<br />
            MEETS THE GAME.
          </h2>
        </div>
      )}

      {/* 
        ========================================================================
        STAGE 4: SETTLED LANDING HERO CONTENT
        Reveals smoothly once intro sequence completes (or immediately accessible on scroll)
        ========================================================================
      */}
      <div
        className={`hero-container ${
          isIntroActive ? 'hero-container-concealed' : 'hero-container-settled'
        }`}
      >
        {/* Top Kicker / Badge Row */}
        <div className="hero-eyebrow-row">
          <span className="kicker-badge">OFFICIAL EVENT PORTAL</span>
          <span className="kicker-edition">DPL // CRICKET AUCTION</span>
        </div>

        {/* Massive Display Heading — Solid Pure White */}
        <h1 className="hero-title-massive">
          <span className="hero-title-line">DPL</span>
          <span className="hero-title-line">AUCTION.</span>
        </h1>

        {/* Action Buttons */}
        <div className="hero-cta-cluster">
          <button className="btn-primary" onClick={scrollToRegister}>
            <span>REGISTER FOR THE AUCTION</span>
            <ArrowIcon size={15} />
          </button>
          
          <button className="btn-secondary" onClick={scrollToAbout}>
            <span>EXPLORE THE EVENT</span>
            <ArrowIcon direction="down" size={13} />
          </button>
        </div>

        {/* Home Event Overview Cards */}
        <div className="hero-intro-section">
          <div className="intro-section-header">
            <span className="intro-eyebrow">EVENT OVERVIEW</span>
            <h3 className="intro-main-title">WHAT IS DPL AUCTION?</h3>
            <p className="intro-subtitle">
              A quick guide to understanding the purpose, competitive structure, and dynamic experience of the auction floor.
            </p>
          </div>

          <div className="home-intro-grid">
            {homeIntroCards.map((card, idx) => {
              const IconComp = introIcons[idx % introIcons.length]
              return (
                <div key={card.num} className="home-intro-card">
                  <div className="intro-card-top">
                    <div className="intro-icon-circle">
                      <IconComp size={18} />
                    </div>
                    <span className="intro-serial-num">{card.num}</span>
                  </div>

                  <span className="intro-card-label">{card.label}</span>
                  <h4 className="intro-card-heading">{card.title}</h4>
                  <p className="intro-card-body">{card.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
