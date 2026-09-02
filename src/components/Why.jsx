import { whyBenefits } from '../data/eventData'
import { ArrowIcon, TargetIcon, TrophyIcon, TeamIcon, ShieldIcon } from './Icons'

const benefitIcons = [TargetIcon, TrophyIcon, TeamIcon, ShieldIcon]

export default function Why() {
  return (
    <section id="why-participate" className="why-section section-grid">
      <div className="section-header-block" data-reveal>
        <div className="section-badge-row">
          <span className="badge-line" />
          <span className="section-badge-text">02 // WHY PARTICIPATE</span>
          <span className="badge-line" />
        </div>

        <h2 className="section-heading-display">
          WHY ENTER THE<br />
          <span className="accent-gradient-blue">DPL ARENA.</span>
        </h2>

        <div className="heading-accent-line-blue" />
        
        <p className="section-lead-copy">
          Whether you are a cricket strategist, team leader, or sports enthusiast, the DPL Auction offers a unique arena to test your tactical intuition, collaborative decision-making, and high-pressure execution.
        </p>
      </div>

      {/* 4 Premium Benefit Cards */}
      <div className="why-pillars-grid" data-reveal data-delay="1">
        {whyBenefits.map((benefit, idx) => {
          const IconComp = benefitIcons[idx % benefitIcons.length]
          return (
            <article key={benefit.num} className="why-pillar-card" tabIndex={0}>
              <div className="card-top-accent-blue" />
              
              <div className="pillar-card-inner">
                <div className="pillar-header-row">
                  <div className="pillar-icon-box">
                    <IconComp size={22} />
                  </div>
                  <span className="pillar-tag-badge">{benefit.tag}</span>
                </div>

                <div className="pillar-main-content">
                  <span className="pillar-num-display">{benefit.num}</span>
                  <span className="pillar-sub-label">{benefit.subtitle}</span>
                  <h3 className="pillar-title-text">{benefit.title}</h3>
                  <p className="pillar-desc-text">{benefit.description}</p>
                </div>

                <div className="pillar-card-footer">
                  <span className="footer-code-tag">DPL // ARENA</span>
                  <ArrowIcon size={14} className="pillar-arrow-icon" />
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
