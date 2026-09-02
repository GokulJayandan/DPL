import { useEffect, useState, useCallback } from 'react'
import { ArrowIcon } from './Icons'

const navItems = [
  ['home', 'HOME'],
  ['about', 'ABOUT'],
  ['why-participate', 'WHY PARTICIPATE'],
  ['schedule', 'SCHEDULE'],
]

export default function Navbar() {
  const [active, setActive] = useState('home')
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Robust Scroll-Spy handler
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 40)

    const scrollPosition = window.scrollY + 160 // Header offset buffer
    const sectionIds = ['home', 'about', 'why-participate', 'schedule']

    let currentSection = 'home'

    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (el) {
        const top = el.offsetTop
        const height = el.offsetHeight
        if (scrollPosition >= top && scrollPosition < top + height) {
          currentSection = id
          break
        }
      }
    }

    // Check if bottom of page reached
    if ((window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 80)) {
      currentSection = 'schedule'
    }

    setActive(currentSection)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const scrollTo = (id) => {
    setActive(id)
    setOpen(false)
    const el = document.getElementById(id)
    if (el) {
      const yOffset = -80
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <header className="nav-wrap">
      <nav className={`nav ${open ? 'nav-open' : ''} ${scrolled ? 'nav-scrolled' : ''}`} aria-label="DPL Auction navigation">
        <button className="brand-logo" onClick={() => scrollTo('home')} aria-label="DPL Auction Home">
          <span className="brand-badge">DPL</span>
          <div className="brand-text">
            <b>AUCTION</b>
            <span>CRICKET ARENA</span>
          </div>
        </button>

        <div className="nav-links">
          {navItems.map(([id, label]) => (
            <button
              key={id}
              className={`nav-link-btn ${active === id ? 'active' : ''}`}
              onClick={() => scrollTo(id)}
              aria-current={active === id ? 'page' : undefined}
            >
              {label}
              <span className="nav-active-pill" />
            </button>
          ))}
        </div>

        <div className="nav-actions">
          <button className="nav-cta-btn" onClick={() => scrollTo('register')}>
            <span>REGISTER TEAM</span>
            <ArrowIcon size={13} />
          </button>

          <button
            className="mobile-menu-btn"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span className={`bar ${open ? 'bar-top-x' : ''}`} />
            <span className={`bar ${open ? 'bar-mid-fade' : ''}`} />
            <span className={`bar ${open ? 'bar-bot-x' : ''}`} />
          </button>
        </div>
      </nav>
    </header>
  )
}
