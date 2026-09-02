import { aboutSections, aboutPillars } from '../data/eventData'
import { TargetIcon, TeamIcon, TrophyIcon, ShieldIcon } from './Icons'

const pillarIcons = {
  target: TargetIcon,
  users: TeamIcon,
  trophy: TrophyIcon,
  shield: ShieldIcon,
}

export default function About() {
  return (
    <section id="about" className="about-section section-grid">
      <div className="section-header-block" data-reveal>
        <div className="section-badge-row">
          <span className="badge-line" />
          <span className="section-badge-text">01 // ABOUT DPL</span>
          <span className="badge-line" />
        </div>

        <h2 className="section-heading-display">
          DPL AUCTION<br />
          <span className="accent-gradient-blue">WHERE CRICKET MEETS STRATEGY.</span>
        </h2>

        <div className="heading-accent-line-blue" />
        
        <p className="section-lead-copy">
          Beyond the boundary ropes, championship squads are conceptualized and constructed in the auction room. Discover how tactical acumen, financial discipline, and teamwork define the DPL Auction.
        </p>
      </div>

      <div className="about-grid-layout">
        {/* Left Column: 3 In-Depth Editorial Narrative Blocks */}
        <div className="about-editorial-col" data-reveal data-delay="1">
          <div className="editorial-cards-list">
            {aboutSections.map((block) => (
              <article key={block.num} className="editorial-text-card">
                <div className="card-kicker-row">
                  <span className="card-num">{block.num}</span>
                  <span className="card-kicker-tag">{block.kicker}</span>
                </div>
                <h3 className="card-headline">{block.headline}</h3>
                <p className="card-lead-text">{block.lead}</p>
                <p className="card-body-text">{block.details}</p>
              </article>
            ))}
          </div>
        </div>

        {/* Right Column: 4 Event Pillars / Dimensions */}
        <div className="about-highlights-col" data-reveal data-delay="2">
          <div className="highlights-header">
            <h3 className="highlights-title">EVENT DIMENSIONS</h3>
            <span className="highlights-sub">KEY ATTRIBUTES</span>
          </div>

          <div className="highlights-cards-grid">
            {aboutPillars.map((pillar) => {
              const IconComponent = pillarIcons[pillar.icon] || TargetIcon
              return (
                <div key={pillar.title} className="highlight-feature-card">
                  <div className="hl-icon-wrap">
                    <IconComponent size={20} />
                  </div>
                  <div className="hl-content">
                    <span className="hl-tag">{pillar.tag}</span>
                    <h4 className="hl-name">{pillar.title}</h4>
                    <p className="hl-desc">{pillar.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
