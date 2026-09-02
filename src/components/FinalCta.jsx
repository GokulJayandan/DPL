import { event } from '../data/eventData'
import { ArrowIcon } from './Icons'

export default function FinalCta() {
  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      const yOffset = -80
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  const handleRegister = (e) => {
    e.preventDefault()
    alert('DPL Auction Registration — Please connect with your organizing committee coordinator to submit your franchise details.')
  }

  return (
    <>
      <section id="register" className="final-cta-section section-grid">
        <div className="cta-ambient-glow-blue" aria-hidden="true" />

        <div className="cta-content-wrapper" data-reveal>
          <div className="section-badge-row">
            <span className="badge-line" />
            <span className="section-badge-text">OFFICIAL REGISTRATION</span>
            <span className="badge-line" />
          </div>

          <h2 className="cta-huge-title">
            READY TO BUILD<br />
            <span className="accent-gradient-blue">YOUR SQUAD?</span>
          </h2>

          <div className="cta-triad-statement">
            <span>YOUR SQUAD.</span>
            <span className="text-accent-blue">YOUR STRATEGY.</span>
            <span>YOUR MOVE.</span>
          </div>

          <p className="cta-lead-text">
            Assemble your franchise war room, formulate your target player list, and step onto the DPL Auction floor.
          </p>

          <div className="cta-btn-wrap">
            <a
              href={event.registrationUrl}
              className="btn-primary btn-large"
              onClick={handleRegister}
            >
              <span>REGISTER YOUR TEAM</span>
              <ArrowIcon size={16} />
            </a>
          </div>

          {/* Clean Neutral Event Parameter Bar */}
          <div className="cta-parameter-bar">
            <div className="param-item">
              <span className="param-label">EVENT</span>
              <strong className="param-val">DPL AUCTION</strong>
            </div>
            <div className="param-item">
              <span className="param-label">FORMAT</span>
              <strong className="param-val">CRICKET AUCTION</strong>
            </div>
            <div className="param-item">
              <span className="param-label">STATUS</span>
              <strong className="param-val text-accent-blue">REGISTRATION OPEN</strong>
            </div>
            <div className="param-item">
              <span className="param-label">PASS</span>
              <strong className="param-val">OFFICIAL TEAM DOCKET</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Editorial Sports Footer */}
      <footer className="site-footer">
        <div className="footer-inner section-grid">
          <div className="footer-brand-col">
            <div className="footer-logo">
              <span className="footer-badge">DPL</span>
              <b className="footer-title">AUCTION</b>
            </div>
            <p className="footer-tagline">
              WHERE STRATEGY MEETS THE GAME.
            </p>
            <span className="footer-edition-text">OFFICIAL CRICKET AUCTION EVENT PORTAL</span>
          </div>

          <div className="footer-nav-col">
            <span className="footer-heading">NAVIGATION</span>
            <button onClick={() => scrollToSection('home')}>HOME</button>
            <button onClick={() => scrollToSection('about')}>ABOUT DPL</button>
            <button onClick={() => scrollToSection('why-participate')}>WHY PARTICIPATE</button>
            <button onClick={() => scrollToSection('schedule')}>EVENT SCHEDULE</button>
          </div>

          <div className="footer-nav-col">
            <span className="footer-heading">COMMUNITY &amp; CONTACT</span>
            <a href={event.social.instagram} target="_blank" rel="noreferrer">INSTAGRAM ↗</a>
            <a href={event.social.linkedin} target="_blank" rel="noreferrer">LINKEDIN ↗</a>
            <a href={event.social.twitter} target="_blank" rel="noreferrer">X (TWITTER) ↗</a>
            <a href={`mailto:${event.email}`}>{event.email}</a>
          </div>
        </div>

        <div className="footer-bottom-bar section-grid">
          <span>&copy; {new Date().getFullYear()} DPL AUCTION. ALL RIGHTS RESERVED.</span>
          <span>OFFICIAL SPORTS AUCTION EVENT PORTAL</span>
        </div>
      </footer>
    </>
  )
}
