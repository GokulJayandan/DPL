import { schedulePhases } from '../data/eventData'
import { CheckIcon, ArrowIcon } from './Icons'

export default function Schedule() {
  return (
    <section id="schedule" className="schedule-section section-grid">
      <div className="section-header-block" data-reveal>
        <div className="section-badge-row">
          <span className="badge-line" />
          <span className="section-badge-text">03 // EVENT TIMELINE</span>
          <span className="badge-line" />
        </div>

        <h2 className="section-heading-display">
          THE AUCTION<br />
          <span className="accent-gradient-blue">ROADMAP &amp; PHASES.</span>
        </h2>

        <div className="heading-accent-line-blue" />

        <p className="section-lead-copy">
          The event progresses through four clear, structured milestones—ensuring fair play, tactical clarity, and an authentic competitive auction floor experience.
        </p>
      </div>

      {/* Structured Roadmap Timeline with Connecting Blue Line */}
      <div className="timeline-container" data-reveal data-delay="1">
        <div className="timeline-track-line-blue" aria-hidden="true" />

        <div className="timeline-phases-grid">
          {schedulePhases.map((phase) => (
            <article key={phase.phase} className="timeline-node-card" tabIndex={0}>
              <div className="node-marker-wrap">
                <div className="node-marker-circle-blue">
                  <CheckIcon size={14} />
                </div>
                <div className="node-pulse-ring-blue" />
              </div>

              <div className="node-card-body">
                <div className="node-top-strip">
                  <span className="node-phase-badge-blue">{phase.status}</span>
                  <span className="node-timing-tag">{phase.timing}</span>
                </div>

                <h3 className="node-phase-title">{phase.title}</h3>
                <p className="node-phase-desc">{phase.desc}</p>

                <div className="node-card-footer">
                  <span className="footer-step-label">OFFICIAL MILESTONE</span>
                  <ArrowIcon size={12} className="node-arrow-blue" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
