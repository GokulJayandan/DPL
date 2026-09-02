import { useScrollReveal } from './hooks/useScrollReveal'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Why from './components/Why'
import Schedule from './components/Schedule'
import FinalCta from './components/FinalCta'
import CinematicLoader from './components/CinematicLoader'
import CricketCursorBackground from './components/CricketCursorBackground'

export default function App() {
  useScrollReveal()

  return (
    <div className="site-wrapper">
      {/* 
        Layer 9999: Cinematic Initial Landing Experience & Loader (01% → 100%)
        Plays video/cinematic-intro.mp4 on initial open, smoothly reveals the DPL Auction
        landing page, then unmounts completely. NO global video background.
      */}
      <CinematicLoader />
      <CricketCursorBackground />

      {/* Layer 100: Navigation Bar */}
      <Navbar />

      {/* Layer 10: Main Website Content Stream */}
      <main className="main-content-stream">
        <Hero />
        <About />
        <Why />
        <Schedule />
        <FinalCta />
      </main>
    </div>
  )
}
