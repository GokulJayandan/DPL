import { ArrowIcon } from './Icons'
import HeroCollage from './HeroCollage'

/**
 * Hero Component — Direct Landing:
 * Shows the dynamic scrolling collage background with DPL AUCTION heading and CTA buttons immediately on load.
 * No intro text phases or cards below.
 */
export default function Hero() {
  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToRegister = () => {
    document.getElementById('registration-action')?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }

  return (
    <section id="home" className="hero-section section-grid">
      {/* Scrolling image collage background */}
      <HeroCollage />

      <div className="hero-container hero-container-settled">
        {/* Top Kicker / Badge Row */}
        <div className="hero-eyebrow-row">
          <span className="kicker-badge">OFFICIAL EVENT PORTAL</span>
          <span className="kicker-edition">DPL // CRICKET AUCTION</span>
        </div>

        {/* Massive Display Heading */}
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
      </div>
    </section>
  )
}
